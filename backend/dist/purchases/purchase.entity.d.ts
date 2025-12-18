import { PurchaseItem } from './purchase-item.entity';
export declare enum PurchaseStatus {
    ORDERED = "Sipari\u015F Verildi",
    PRODUCING = "\u00DCretimde",
    SHIPPED = "Yolda",
    RECEIVED = "Teslim Al\u0131nd\u0131"
}
export declare class Purchase {
    id: string;
    factoryName: string;
    status: PurchaseStatus;
    totalAmount: number;
    date: Date;
    estimatedDeliveryDate: Date;
    items: PurchaseItem[];
}
