import { Purchase } from './purchase.entity';
export declare class PurchaseItem {
    id: number;
    purchase: Purchase;
    productId: number;
    productSku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
