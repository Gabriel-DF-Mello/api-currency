import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<number>('CACHE_TTL'),
        // If using Redis:
        // store: redisStore,
        // host: configService.get('REDIS_HOST'),
      }),
    }),
    CurrencyModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
