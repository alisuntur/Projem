import { Repository } from 'typeorm';
import { Product } from './product.entity';
export declare class ProductsService {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    create(createProductDto: Partial<Product>): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<Product | null>;
    update(id: number, updateProductDto: Partial<Product>): Promise<Product | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
