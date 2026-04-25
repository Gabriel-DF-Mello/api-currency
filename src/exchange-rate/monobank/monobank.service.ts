import { HttpException, Inject, Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ExchangeRateProvider, ExchangeRate } from '../exchange-rate-provider.abstract';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MonobankGetCurrencyResponse } from './monobank.type';
import type { Cache } from 'cache-manager';
import { CACHE } from 'src/constants';
import * as currencyCodes from 'currency-codes';

@Injectable()
export class MonobankService implements ExchangeRateProvider {
	private readonly logger = new Logger(MonobankService.name);

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
		@Inject('CACHE_MANAGER') private cacheManager: Cache,
	) {}

	private async getAllExchangeRates(): Promise<MonobankGetCurrencyResponse> {
		const rates = await this.cacheManager.get<MonobankGetCurrencyResponse>(CACHE.EXCHANGE_RATES.MONOBANK)
		if(rates){
			return rates
		}

		const baseUrl = this.configService.get<string>('MONOBANK_API_URL');
		const response$ = this.httpService.get(`${baseUrl}/bank/currency`);
		const response = await firstValueFrom(response$);

		await this.cacheManager.set(CACHE.EXCHANGE_RATES.MONOBANK, response.data)

		return response.data
	}

	async getExchangeRate(
		sourceCurrency: string,
		targetCurrency: string
	): Promise<ExchangeRate> {
		try{
			const sourceCurrencyNumber = currencyCodes.code(sourceCurrency)?.number;
			const targetCurrencyNumber = currencyCodes.code(targetCurrency)?.number;

			const rates = await this.getAllExchangeRates()

			const matchingRate = rates.find(
				(rate) =>
					(rate.currencyCodeA.toString() === sourceCurrencyNumber && rate.currencyCodeB.toString() === targetCurrencyNumber) ||
					(rate.currencyCodeA.toString() === targetCurrencyNumber && rate.currencyCodeB.toString() === sourceCurrencyNumber),
			);

			if (!matchingRate) {
				throw new NotFoundException(
					`Could not find exchange rate between ${sourceCurrency} and ${targetCurrency}`,
				);
			}

			let rate: number;
				if ('rateCross' in matchingRate) {
					rate = matchingRate.rateCross;
				} else if (
					matchingRate.currencyCodeA.toString() === sourceCurrencyNumber
				) {
					rate = matchingRate.rateBuy;
				} else {
					rate = 1 / matchingRate.rateSell;
				}

			return {
				rate
			}
		} catch (error) {
			if (error instanceof HttpException) {
				this.logger.warn(
					`Could not get exchange rates from monobank API: ${error.message}`,
				);
				throw error;
			}

			this.logger.error(
				'Could not get exchange rates from monobank API:',
				error,
			);

			throw new ServiceUnavailableException('Internal server error', {
				description: 'Error on exchange rate API',
			});
		}
	}
}