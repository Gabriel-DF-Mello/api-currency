import { Body, Controller, Post } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ConvertCurrencyDto } from './dto';

@Controller('currency')
export class CurrencyController {
    constructor(private converter: CurrencyService) {}

    @Post('convert')
    convert(@Body() dto: ConvertCurrencyDto) {
      return this.converter.convertCurrency(dto);
    }
}
