import { Repository } from 'typeorm';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';
import { Customer } from '../customers/customer.entity';
export declare class DashboardService {
    private saleRepo;
    private productRepo;
    private customerRepo;
    constructor(saleRepo: Repository<Sale>, productRepo: Repository<Product>, customerRepo: Repository<Customer>);
    getOverview(): Promise<{
        kpi: {
            revenue: number;
            pendingOrders: number;
            criticalStock: number;
            balance: number;
        };
        salesChart: {
            name: string;
            uv: number;
        }[];
        brandChart: {
            name: string;
            value: number;
        }[];
    }>;
}
