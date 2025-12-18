import { ProductsService } from './products.service';
import { Product } from './product.entity';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: Partial<Product>): Promise<Product>;
    findAll(supplierId?: string): Promise<Product[]>;
    findOne(id: string): Promise<Product | null>;
    update(id: string, updateProductDto: Partial<Product>): Promise<Product | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
