import { Repository, DataSource } from 'typeorm';
import { Payment } from './payment.entity';
import { Customer } from '../customers/customer.entity';
import { Supplier } from '../suppliers/supplier.entity';
export declare class FinanceService {
    private paymentRepo;
    private customerRepo;
    private supplierRepo;
    private dataSource;
    constructor(paymentRepo: Repository<Payment>, customerRepo: Repository<Customer>, supplierRepo: Repository<Supplier>, dataSource: DataSource);
    getStats(): Promise<{
        totalReceivables: number;
        totalPayables: number;
    }>;
    addPayment(dto: any): Promise<Payment>;
    getHistory(): Promise<Payment[]>;
}
