import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CustomerType {
    INDIVIDUAL = 'individual',
    CORPORATE = 'corporate',
}

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: CustomerType,
        default: CustomerType.INDIVIDUAL,
    })
    type: CustomerType;

    // Bireysel için Ad Soyad, Kurumsal için Firma Adı
    @Column()
    name: string;

    // Kurumsal için Yetkili Kişi
    @Column({ nullable: true })
    contactPerson: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    district: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    // Kurumsal Bilgiler
    @Column({ nullable: true })
    taxOffice: string;

    @Column({ nullable: true })
    taxNumber: string;

    // Bireysel Bilgiler
    @Column({ nullable: true, length: 11 })
    tcIdentityNumber: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    balance: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
