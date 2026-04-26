import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { CurrencyModule } from './currency/currency.module';
import { HealthModule } from './health/health.module';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { KeyvCacheableMemory } from 'cacheable';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
		ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL') || 1000,
          limit: config.get<number>('THROTTLE_LIMIT') || 5,
        },
      ],
    }),
    CurrencyModule,
    HealthModule
  ],
  controllers: [],
  providers: [
		{
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
	],
})
export class AppModule {}
