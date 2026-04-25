import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from '../currency.controller';
import { CurrencyService } from '../currency.service';
import { ConvertCurrencyDto } from '../dto';
import { ExchangeRateProvider } from '../../exchange-rate/exchange-rate-provider.abstract';

describe('CurrencyController', () => {
  let controller: CurrencyController;
  let exchangeRateProviderMock: jest.Mocked<ExchangeRateProvider>;

  beforeEach(async () => {
    exchangeRateProviderMock = {
      getExchangeRate: jest.fn().mockResolvedValue({
        rate: 2
      }),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        CurrencyService,
        {
          provide: ExchangeRateProvider,
          useValue: exchangeRateProviderMock,
        },
      ],
    }).compile();

    controller = moduleRef.get<CurrencyController>(CurrencyController);
  });

  describe('convertCurrency', () => {
    it('should convert currency and return the converted amount', async () => {
			const expected = {
				currency: 'EUR',
        amount: 200,
      };

      const dto: ConvertCurrencyDto = {
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
				amount: 100,
      };

      const result = await controller.convert(dto);

      expect(result).toEqual(expected);
    });
  });
});