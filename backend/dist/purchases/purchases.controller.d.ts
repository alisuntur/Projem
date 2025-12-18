import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './create-purchase.dto';
import { PurchaseStatus } from './purchase.entity';
export declare class PurchasesController {
    private readonly purchasesService;
    constructor(purchasesService: PurchasesService);
    create(createPurchaseDto: CreatePurchaseDto): Promise<import("./purchase.entity").Purchase>;
    findAll(): Promise<import("./purchase.entity").Purchase[]>;
    findOne(id: string): Promise<import("./purchase.entity").Purchase | null>;
    update(id: string, updateData: any): Promise<import("./purchase.entity").Purchase | null>;
    receive(id: string): Promise<import("./purchase.entity").Purchase>;
    updateStatus(id: string, status: PurchaseStatus): Promise<import("./purchase.entity").Purchase>;
}
