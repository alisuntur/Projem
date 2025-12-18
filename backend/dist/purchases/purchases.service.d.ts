import { Repository, DataSource } from 'typeorm';
import { Purchase, PurchaseStatus } from './purchase.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { CreatePurchaseDto } from './create-purchase.dto';
export declare class PurchasesService {
    private purchasesRepository;
    private supplierRepository;
    private dataSource;
    constructor(purchasesRepository: Repository<Purchase>, supplierRepository: Repository<Supplier>, dataSource: DataSource);
    create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase>;
    findAll(): Promise<Purchase[]>;
    findOne(id: string): Promise<Purchase | null>;
    update(id: string, updateData: any): Promise<Purchase | null>;
    receivePurchase(id: string): Promise<Purchase>;
    updateStatus(id: string, status: PurchaseStatus): Promise<Purchase>;
}
