import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { PurchaseItem } from './purchase-item.entity';

export enum PurchaseStatus {
    ORDERED = 'Sipariş Verildi',
    PRODUCING = 'Üretimde',
    SHIPPED = 'Yolda',
    RECEIVED = 'Teslim Alındı',
}

@Entity('purchases')
export class Purchase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    factoryName: string; // e.g. "Merinos Ana Fabrika"

    @Column({ type: 'enum', enum: PurchaseStatus, default: PurchaseStatus.ORDERED })
    status: PurchaseStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @CreateDateColumn()
    date: Date; // Order Date

    @Column({ nullable: true })
    estimatedDeliveryDate: Date;

    @OneToMany(() => PurchaseItem, (item) => item.purchase, { cascade: true })
    items: PurchaseItem[];
}
