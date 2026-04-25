import { Expose } from "class-transformer";
import { IsISO4217CurrencyCode, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class ConvertCurrencyDto {
    @Expose({ name: 'original_currency' })
    @IsNotEmpty()
    @IsString()
    @IsISO4217CurrencyCode()
    originalCurrency!: string;
  
    @Expose({ name: 'new_currency' })
    @IsNotEmpty()
    @IsString()
    @IsISO4217CurrencyCode()
    newCurrency!: string;
  
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'amount must have at most 2 decimal places' })
    @IsPositive()
    amount!: number;
  }