declare class PurchaseItemDto {
    productId: number;
    quantity: number;
    unitPrice?: number;
}
export declare class CreatePurchaseDto {
    factoryName: string;
    items: PurchaseItemDto[];
}
export {};
