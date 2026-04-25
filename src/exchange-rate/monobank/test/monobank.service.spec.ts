import { CACHE } from '../../../constants';
import { MonobankService } from '../monobank.service';
import { of } from 'rxjs';

describe('MonobankService', () => {
  let monobankService: MonobankService;

  beforeEach(async () => {
		const httpServiceMock: any = {
			get: jest.fn().mockReturnValue(of({ data: exchangeRatesMock }))
		}
		const configServiceMock: any = {
			get: jest.fn().mockReturnValue('https://api.mock'),
		}
		const cacheManagerMock: any = {
			get: jest.fn().mockReturnValue(null),
      set: jest.fn(),
		}

    monobankService = new MonobankService(httpServiceMock, configServiceMock, cacheManagerMock);
  });

  it('should be defined', () => {
    expect(monobankService).toBeDefined();
  });

  it('should get all exchange rates', async () => {
    const getAllSpy = jest.spyOn(monobankService['httpService'], 'get');

    await monobankService.getExchangeRate('USD', 'EUR');

    expect(getAllSpy).toHaveBeenCalledWith('https://api.mock/bank/currency');
  });

  it('should use cache if exists', async () => {
    const getCacheSpy = jest
      .spyOn(monobankService['cacheManager'], 'get')
      .mockResolvedValue(exchangeRatesMock);

    await monobankService.getExchangeRate('USD', 'EUR');

    expect(getCacheSpy).toHaveBeenCalledWith(CACHE.EXCHANGE_RATES.MONOBANK);
  });

  it('should set cache if it does not exist', async () => {
    const setCacheSpy = jest.spyOn(monobankService['cacheManager'], 'set');

    await monobankService.getExchangeRate('USD', 'EUR');

    expect(setCacheSpy).toHaveBeenCalledWith(
      CACHE.EXCHANGE_RATES.MONOBANK,
      exchangeRatesMock,
    );
  });

  it('should throw an error if a currency code is not valid', async () => {
    await expect(
      monobankService.getExchangeRate('USD', 'NONE'),
    ).rejects.toThrow();
  });

  it('should throw an error if an exchange rate is not found', async () => {
    await expect(
      monobankService.getExchangeRate('USD', 'BRL'),
    ).rejects.toThrow();
  });
});

const exchangeRatesMock = [
  {
    currencyCodeA: 978,
    currencyCodeB: 840,
    date: 1777064473,
    rateBuy: 1.165,
    rateSell: 1.175,
  },
];