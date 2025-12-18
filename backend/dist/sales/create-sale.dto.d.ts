declare class SaleItemDto {
    productId: number;
    quantity: number;
}
export declare class CreateSaleDto {
    customerId: number;
    items: SaleItemDto[];
    status?: any;
}
export {};
