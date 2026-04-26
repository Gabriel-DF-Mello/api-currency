import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { CacheHealthIndicator } from './cache.health';

@Controller('health')
export class HealthController {
	constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
		private config: ConfigService,
		private cacheHealth: CacheHealthIndicator
  ) {}

	@Get()
	@HealthCheck()
	check(){
		return this.health.check([
    () =>
      this.http.responseCheck(
        'monobank-api',
        this.config.get<string>('MONOBANK_API_URL') || '',
        (res) => res.status === 200,
      ),
		
		() =>
      this.cacheHealth.isHealthy('cache'),
  ]);
	}

}
