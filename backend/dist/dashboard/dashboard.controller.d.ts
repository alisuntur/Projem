import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private service;
    constructor(service: DashboardService);
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
