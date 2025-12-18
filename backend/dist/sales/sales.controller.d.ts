import { SalesService } from './sales.service';
import { CreateSaleDto } from './create-sale.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto): Promise<import("./sale.entity").Sale>;
    findAll(): Promise<import("./sale.entity").Sale[]>;
    findOne(id: string): Promise<import("./sale.entity").Sale | null>;
}
