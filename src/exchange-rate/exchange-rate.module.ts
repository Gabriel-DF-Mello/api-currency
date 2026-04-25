import { Module } from '@nestjs/common';
import { MonobankService } from './monobank/monobank.service';
import { DynamicModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExchangeRateProvider } from './exchange-rate-provider.abstract';

@Module({})
export class ExchangeRateModule {
    static register(): DynamicModule {
    return {
      module: ExchangeRateModule,
      providers: [
        {
          provide: ExchangeRateProvider,
          useClass: MonobankService,
        },
      ],
      exports: [ExchangeRateProvider],
      imports: [HttpModule.register({
        timeout: 5000,
        maxRedirects: 5,
      }),],
    };
  }
}
