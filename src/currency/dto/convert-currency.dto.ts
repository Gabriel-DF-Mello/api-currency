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
    @IsNumber()
    @IsPositive()
    amount!: number;
  }