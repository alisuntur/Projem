import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Purchase } from './purchase.entity';

@Entity('purchase_items')
export class PurchaseItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Purchase, (purchase) => purchase.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'purchase_id' })
    purchase: Purchase;

    // purchaseId removed to rely on relation FK


    @Column({ nullable: true })
    productId: number; // Might be null if it's a new product or not matched yet

    @Column()
    productSku: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalPrice: number;
}
