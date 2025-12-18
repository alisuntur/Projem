import { SuppliersService } from './suppliers.service';
import { Supplier } from './supplier.entity';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    create(createSupplierDto: Partial<Supplier>): Promise<Supplier>;
    findAll(): Promise<Supplier[]>;
    findOne(id: string): Promise<Supplier | null>;
    update(id: string, updateSupplierDto: Partial<Supplier>): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
    addProduct(id: string, productId: string): Promise<Supplier | null>;
    removeProduct(id: string, productId: string): Promise<Supplier | null>;
}
