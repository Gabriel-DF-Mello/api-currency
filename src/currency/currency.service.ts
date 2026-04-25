import { Injectable } from '@nestjs/common';
import { ConvertCurrencyDto } from './dto';
import { ExchangeRateProvider } from 'src/exchange-rate/exchange-rate-provider.abstract';

@Injectable()
export class CurrencyService {
	constructor(private exchangeRateProvider: ExchangeRateProvider) {}

	async convertCurrency(dto: ConvertCurrencyDto){
		const { originalCurrency, newCurrency, amount } = dto;

		const exchangeRate = await this.exchangeRateProvider.getExchangeRate(
			originalCurrency,
			newCurrency,
		);

		const newAmount = amount * exchangeRate.rate

		return {
			currency: newCurrency,
			amount: Number(newAmount.toFixed(2))
		}
	}
}
