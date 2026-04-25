import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { ConfigService } from '@nestjs/config';
import * as pactum from 'pactum';
import { ConvertCurrencyDto } from 'src/currency/dto';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
	let configService: ConfigService;

	beforeAll(async () => {

		const httpServiceMock: any = {
			get: jest.fn().mockReturnValue(of({data: exchangeRatesMock, status: 200, statusText: 'OK'}))
		}
		
		const moduleRef = await Test.createTestingModule({
      imports: [
				AppModule,
				CacheModule.register(),
			],
      controllers: [],
      providers: [],
    }).overrideProvider(HttpService)
      .useValue(httpServiceMock)
			.compile();
    app = moduleRef.createNestApplication();

		app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    configService = app.get(ConfigService);

    await app.init();
    await app.listen(3333);

		pactum.request.setBaseUrl('http://localhost:3333');
	});

	afterAll(() => {
    app.close();
  });

	describe('Currency', () => {
    describe('Convert currency', () => {
      it('should convert the currency', () => {

        const dto = {
					original_currency: "USD",
					new_currency: "EUR",
					amount: 300
        };
        return pactum
          .spec()
          .post('/currency/convert')
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.new_currency)
      });

			it('should fail due to missing field', () => {
        const dto = {
					original_currency: "USD",
					new_currency: "EUR",
        };
        return pactum
          .spec()
          .post('/currency/convert')
          .withBody(dto)
          .expectStatus(400)
      });

			it('should should fail due to invalid currency', () => {
        const dto = {
					original_currency: "USD",
					new_currency: "NONE",
					amount: 400
        };
        return pactum
          .spec()
          .post('/currency/convert')
          .withBody(dto)
          .expectStatus(400)
      });

			it('should should fail due to invalid amount', () => {
        const dto = {
					original_currency: "USD",
					new_currency: "EUR",
					amount: 400.2093
        };
        return pactum
          .spec()
          .post('/currency/convert')
          .withBody(dto)
          .expectStatus(400)
      });

			it('should should fail due to conversion not being available', () => {
        const dto = {
					original_currency: "USD",
					new_currency: "BRL",
					amount: 400
        };
        return pactum
          .spec()
          .post('/currency/convert')
          .withBody(dto)
          .expectStatus(404)
      });
    });
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
]