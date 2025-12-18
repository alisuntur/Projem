import { Repository } from 'typeorm';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';
import { Customer } from '../customers/customer.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { Payment } from '../finance/payment.entity';
import { Purchase } from '../purchases/purchase.entity';
export declare class DashboardService {
    private saleRepo;
    private productRepo;
    private customerRepo;
    private supplierRepo;
    private paymentRepo;
    private purchaseRepo;
    constructor(saleRepo: Repository<Sale>, productRepo: Repository<Product>, customerRepo: Repository<Customer>, supplierRepo: Repository<Supplier>, paymentRepo: Repository<Payment>, purchaseRepo: Repository<Purchase>);
    getOverview(): Promise<{
        kpi: {
            revenue: number;
            pendingOrders: number;
            criticalStock: number;
            customerBalance: number;
            supplierBalance: number;
            totalIncome: number;
            totalExpense: number;
            totalPurchases: number;
            customerCount: number;
            supplierCount: number;
            productCount: number;
        };
        salesChart: {
            name: string;
            uv: number;
        }[];
        brandChart: {
            name: string;
            value: number;
        }[];
        topSuppliers: {
            name: string;
            value: number;
        }[];
        topCustomers: {
            name: string;
            value: number;
        }[];
    }>;
}
