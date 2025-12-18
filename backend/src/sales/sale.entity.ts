import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Customer } from '../customers/customer.entity';
import { SaleItem } from './sale-item.entity';

export enum SaleStatus {
    PENDING = 'Bekliyor',
    PREPARING = 'Hazırlanıyor',
    SHIPPED = 'Kargoda',
    DELIVERED = 'Teslim Edildi',
    CANCELLED = 'İptal',
}

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn('uuid') // Using UUID for order numbers like ORD-24-1001 (or just autoincrement ID mapped to string)
    id: string;

    @ManyToOne(() => Customer, { eager: true }) // Eager load customer data
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;



    @Column({ type: 'enum', enum: SaleStatus, default: SaleStatus.PREPARING })
    status: SaleStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @CreateDateColumn()
    date: Date; // Order Date

    @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
    items: SaleItem[];
}
