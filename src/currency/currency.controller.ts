import { Body, Controller, Post } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ConvertCurrencyDto } from './dto';

@Controller('currency')
export class CurrencyController {
    constructor(private converter: CurrencyService) {}

		/*
		Example:
		body: {
			"source_currency": "USD"
			"target_currency": "EUR"
			"amount": 300
		}
		response: {
			status: 201,
			data: {
				"currency": "EUR",
				"amount": 600
			}
		}
		*/
    @Post('convert')
    convert(@Body() dto: ConvertCurrencyDto) {
      return this.converter.convertCurrency(dto);
    }
}
