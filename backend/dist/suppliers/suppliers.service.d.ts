import { Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { Product } from '../products/product.entity';
import { Payment } from '../finance/payment.entity';
import { Purchase } from '../purchases/purchase.entity';
export declare class SuppliersService {
    private suppliersRepository;
    private productsRepository;
    private paymentRepository;
    private purchaseRepository;
    constructor(suppliersRepository: Repository<Supplier>, productsRepository: Repository<Product>, paymentRepository: Repository<Payment>, purchaseRepository: Repository<Purchase>);
    create(createSupplierDto: Partial<Supplier>): Promise<Supplier>;
    findAll(): Promise<Supplier[]>;
    findOne(id: number): Promise<Supplier | null>;
    update(id: number, updateSupplierDto: Partial<Supplier>): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
    addProductToSupplier(supplierId: number, productId: number): Promise<Supplier | null>;
    removeProductFromSupplier(supplierId: number, productId: number): Promise<Supplier | null>;
}
