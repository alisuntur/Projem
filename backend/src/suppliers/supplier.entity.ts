import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('suppliers')
export class Supplier {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string; // 'Factory', 'Wholesaler'

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    balance: number; // Positive = We owe them



    @Column({ nullable: true })
    contactInfo: string;

    @Column({ nullable: true })
    address: string;

    @ManyToMany(() => Product, (product) => product.suppliers)
    @JoinTable({
        name: 'supplier_products', // Custom join table name
        joinColumn: { name: 'supplierId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'productId', referencedColumnName: 'id' }
    })
    products: Product[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
