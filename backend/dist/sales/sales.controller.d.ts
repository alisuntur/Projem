import { SalesService } from './sales.service';
import { CreateSaleDto } from './create-sale.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto): Promise<import("./sale.entity").Sale>;
    findAll(page: string, limit: string, search: string, status: string): Promise<{
        data: import("./sale.entity").Sale[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStats(): Promise<{
        total: number;
        pending: number;
        preparing: number;
        onWay: number;
        delivered: number;
    }>;
    updateStatus(id: string, status: string): Promise<import("./sale.entity").Sale>;
    findOne(id: string): Promise<import("./sale.entity").Sale | null>;
}
