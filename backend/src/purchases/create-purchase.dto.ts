import { IsNotEmpty, IsInt, IsPositive, ValidateNested, Min, IsString, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class PurchaseItemDto {
    @IsInt()
    @IsPositive()
    productId: number;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    unitPrice?: number;
}

export class CreatePurchaseDto {
    @IsString()
    @IsNotEmpty()
    factoryName: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PurchaseItemDto)
    items: PurchaseItemDto[];
}
