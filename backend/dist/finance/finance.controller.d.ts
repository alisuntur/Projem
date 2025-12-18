import { FinanceService } from './finance.service';
export declare class FinanceController {
    private service;
    constructor(service: FinanceService);
    getStats(): Promise<{
        totalReceivables: number;
        totalPayables: number;
    }>;
    getHistory(): Promise<import("./payment.entity").Payment[]>;
    addPayment(body: any): Promise<import("./payment.entity").Payment>;
}
