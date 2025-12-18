import { Repository, DataSource } from 'typeorm';
import { Product } from './product.entity';
export declare class ProductsService {
    private productsRepository;
    private dataSource;
    constructor(productsRepository: Repository<Product>, dataSource: DataSource);
    create(createProductDto: Partial<Product>): Promise<Product>;
    findAll(supplierId?: number): Promise<Product[]>;
    findOne(id: number): Promise<Product | null>;
    update(id: number, updateProductDto: Partial<Product>): Promise<Product | null>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}
