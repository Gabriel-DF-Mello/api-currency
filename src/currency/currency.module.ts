import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { ExchangeRateModule } from 'src/exchange-rate/exchange-rate.module';

@Module({
  imports:[ExchangeRateModule.register()],
  providers: [CurrencyService],
  controllers: [CurrencyController]
})
export class CurrencyModule {}
