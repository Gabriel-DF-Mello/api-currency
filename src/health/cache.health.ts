import { Inject, Injectable } from "@nestjs/common";
import { HealthIndicatorService } from "@nestjs/terminus";
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheHealthIndicator {
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key);

    try {
			const timeout = new Promise((_, reject) => {
				setTimeout(() => reject(new Error("Request timed out after 5 seconds")), 5000);
			});

			const check = new Promise((resolve) => {
				const isHealthy = this.cacheManager.set('health-check', 'ok', 1000);
				resolve(isHealthy)
			});

			return Promise.race([check, timeout])
			.then(() => { return indicator.up() })
			.catch(() => { return indicator.down('Unable to set cache health-check') });
    } catch (error) {
      return indicator.down('Unable to set cache health-check');
    }
  }
}
