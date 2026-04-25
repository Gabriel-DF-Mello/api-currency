import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ExchangeRateProvider, ExchangeRate } from '../exchange-rate-provider.abstract';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MonobankGetCurrencyResponse } from './monobank.type';
import type { Cache } from 'cache-manager';
import { MONOBANK_ER_KEY as MONOBANK_EXCHANGE_RATES_KEY } from 'src/exchange-rate/constants';
import * as currencyCodes from 'currency-codes';

@Injectable()
export class MonobankService implements ExchangeRateProvider {

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
		@Inject('CACHE_MANAGER') private cacheManager: Cache,
	) {}

	private async getAllExchangeRates(): Promise<MonobankGetCurrencyResponse> {
		const rates = await this.cacheManager.get<MonobankGetCurrencyResponse>(MONOBANK_EXCHANGE_RATES_KEY)
		if(rates){
			return rates
		}

		const baseUrl = this.configService.get<string>('MONOBANK_API_URL');
		const response$ = this.httpService.get(`${baseUrl}/bank/currency`);
		const response = await firstValueFrom(response$);

		await this.cacheManager.set(MONOBANK_EXCHANGE_RATES_KEY, response.data)

		return response.data
	}

	async getExchangeRate(
		originalCurrency: string,
		newCurrency: string
	): Promise<ExchangeRate> {

		const originalCurrencyNumber = currencyCodes.code(originalCurrency)?.number;
    const newCurrencyNumber = currencyCodes.code(newCurrency)?.number;

		const rates = await this.getAllExchangeRates()

		const matchingRate = rates.find(
			(rate) =>
				(rate.currencyCodeA.toString() === originalCurrencyNumber && rate.currencyCodeB.toString() === newCurrencyNumber) ||
				(rate.currencyCodeA.toString() === newCurrencyNumber && rate.currencyCodeB.toString() === originalCurrencyNumber),
		);

		if (!matchingRate) {
			throw new NotFoundException(
				`Could not find exchange rate between ${originalCurrency} and ${newCurrency}`,
			);
		}

		 let rate: number;
			if ('rateCross' in matchingRate) {
				rate = matchingRate.rateCross;
			} else if (
				matchingRate.currencyCodeA.toString() === originalCurrencyNumber
			) {
				rate = matchingRate.rateBuy;
			} else {
				rate = 1 / matchingRate.rateSell;
			}

		return {
			rate
		}
	}
}