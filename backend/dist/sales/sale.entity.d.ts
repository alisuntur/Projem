import { Customer } from '../customers/customer.entity';
import { SaleItem } from './sale-item.entity';
export declare enum SaleStatus {
    PENDING = "Bekliyor",
    PREPARING = "Haz\u0131rlan\u0131yor",
    SHIPPED = "Kargoda",
    DELIVERED = "Teslim Edildi",
    CANCELLED = "\u0130ptal"
}
export declare class Sale {
    id: string;
    customer: Customer;
    status: SaleStatus;
    totalAmount: number;
    date: Date;
    items: SaleItem[];
}
