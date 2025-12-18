import { Supplier } from '../suppliers/supplier.entity';
export declare class Product {
    id: number;
    name: string;
    sku: string;
    brand: string;
    category: string;
    size: string;
    stock: number;
    criticalLevel: number;
    price: number;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    suppliers: Supplier[];
}
