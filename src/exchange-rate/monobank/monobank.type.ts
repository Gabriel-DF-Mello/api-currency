export type MonobankExchangeRate = {
		currencyCodeA: number;
		currencyCodeB: number;
		date: number;
	} & (
		| {
				rateSell: number;
				rateBuy: number;
			}
		| {
				rateCross: number;
			}
	);
	
export type MonobankGetCurrencyResponse = MonobankExchangeRate[];