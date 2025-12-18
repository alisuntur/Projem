import { Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { Product } from '../products/product.entity';
export declare class SuppliersService {
    private suppliersRepository;
    private productsRepository;
    constructor(suppliersRepository: Repository<Supplier>, productsRepository: Repository<Product>);
    create(createSupplierDto: Partial<Supplier>): Promise<Supplier>;
    findAll(): Promise<Supplier[]>;
    findOne(id: number): Promise<Supplier | null>;
    update(id: number, updateSupplierDto: Partial<Supplier>): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    addProductToSupplier(supplierId: number, productId: number): Promise<Supplier | null>;
    removeProductFromSupplier(supplierId: number, productId: number): Promise<Supplier | null>;
}
