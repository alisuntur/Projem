import { Product } from '../products/product.entity';
export declare class Supplier {
    id: number;
    name: string;
    type: string;
    balance: number;
    balance: number;
    contactInfo: string;
    address: string;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
