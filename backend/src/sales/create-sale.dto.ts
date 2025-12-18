import { IsInt, IsNotEmpty, IsPositive, ValidateNested, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class SaleItemDto {
    @IsInt()
    @IsPositive()
    productId: number;

    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateSaleDto {
    @IsInt()
    @IsPositive()
    customerId: number;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => SaleItemDto)
    items: SaleItemDto[];

    @IsOptional()
    status?: any; // strict typing with enum would be better but requires importing the entity enum which might cause circular dep if not careful. Let's use any for now or move enum to shared file.
}
