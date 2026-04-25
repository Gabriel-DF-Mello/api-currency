export type ExchangeRate = {
    rate: number;
  };
  
  export abstract class ExchangeRateProvider {
    abstract getExchangeRate(
      sourceCurrency: string,
      targetCurrency: string,
    ): Promise<ExchangeRate>;
  }
  