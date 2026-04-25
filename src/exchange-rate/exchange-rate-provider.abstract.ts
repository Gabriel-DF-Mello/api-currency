export type ExchangeRate = {
    rate: number;
  };
  
  export abstract class ExchangeRateProvider {
    abstract getExchangeRate(
      originalCurrency: string,
      newCurrency: string,
    ): Promise<ExchangeRate>;
  }
  