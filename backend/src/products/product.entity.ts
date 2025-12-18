import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Supplier } from '../suppliers/supplier.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    sku: string; // Stok Kodu

    @Column()
    brand: string;

    @Column({ nullable: true })
    category: string;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    width: number; // En (cm)

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    height: number; // Boy (cm)

    @Column({ nullable: true })
    size: string; // Legacy or computed display

    @Column({ type: 'int', default: 0 })
    stock: number; // Current Stock Quantity

    @Column({ type: 'int', default: 10 })
    criticalLevel: number; // Low stock alert level

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: true })
    imageUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => Supplier, (supplier) => supplier.products)
    suppliers: Supplier[];
}

