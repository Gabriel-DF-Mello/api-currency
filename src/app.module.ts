import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { CurrencyModule } from './currency/currency.module';
import { HealthModule } from './health/health.module';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { KeyvCacheableMemory } from 'cacheable';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new KeyvCacheableMemory({ ttl: configService.get<string>('CACHE_TTL'), lruSize: 5000 }),
            }),
            new KeyvRedis(configService.get<string>('REDIS_URL')),
          ],
        };
			},
    }),
    CurrencyModule,
    HealthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
