import { Sale } from './sale.entity';
export declare class SaleItem {
    id: number;
    sale: Sale;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
