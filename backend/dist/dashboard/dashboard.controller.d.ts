import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private service;
    constructor(service: DashboardService);
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
