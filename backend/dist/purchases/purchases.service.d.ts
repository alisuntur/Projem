import { Repository, DataSource } from 'typeorm';
import { Purchase, PurchaseStatus } from './purchase.entity';
import { CreatePurchaseDto } from './create-purchase.dto';
export declare class PurchasesService {
    private purchasesRepository;
    private dataSource;
    constructor(purchasesRepository: Repository<Purchase>, dataSource: DataSource);
    create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase>;
    findAll(): Promise<Purchase[]>;
    receivePurchase(id: string): Promise<Purchase>;
    updateStatus(id: string, status: PurchaseStatus): Promise<Purchase>;
}
