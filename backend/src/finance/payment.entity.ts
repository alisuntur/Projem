import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum PaymentType {
    INCOME = 'income', // Tahsilat (Customer pays us)
    EXPENSE = 'expense' // Ödeme (We pay supplier)
}

export enum PaymentMethod {
    CASH = 'cash',
    CREDIT_CARD = 'credit_card',
    BANK_TRANSFER = 'bank_transfer',
    CHECK = 'check'
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: PaymentType
    })
    type: PaymentType;

    // 'customer' or 'supplier'
    @Column()
    partyType: string;

    @Column()
    partyId: number;

    // Optional name snapshot
    @Column({ nullable: true })
    partyName: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.CASH
    })
    method: PaymentMethod;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    date: Date;
}
