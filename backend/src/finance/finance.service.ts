import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment, PaymentType } from './payment.entity';
import { Customer } from '../customers/customer.entity';
import { Supplier } from '../suppliers/supplier.entity';

@Injectable()
export class FinanceService {
    constructor(
        @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
        @InjectRepository(Customer) private customerRepo: Repository<Customer>,
        @InjectRepository(Supplier) private supplierRepo: Repository<Supplier>,
        private dataSource: DataSource
    ) { }

    async getStats() {
        const customers = await this.customerRepo.find();
        const suppliers = await this.supplierRepo.find();

        // Total Receivables (Alacaklar) -> Positive Customer Balance
        const totalReceivables = customers.reduce((sum, c) => sum + Number(c.balance), 0);

        // Total Payables (Borçlar) -> Positive Supplier Balance
        const totalPayables = suppliers.reduce((sum, s) => sum + Number(s.balance), 0);

        return {
            totalReceivables,
            totalPayables
        };
    }

    async addPayment(dto: any) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { type, partyType, partyId, amount, method, description } = dto;

            const payment = new Payment();
            payment.type = type; // INCOME or EXPENSE
            payment.partyType = partyType;
            payment.partyId = partyId;
            payment.amount = amount;
            payment.method = method;
            payment.description = description;

            // Handle Balance Updates
            if (partyType === 'customer') {
                const customer = await queryRunner.manager.findOne(Customer, { where: { id: partyId } });
                if (!customer) throw new BadRequestException('Customer not found');
                payment.partyName = customer.name;

                // Tahsilat (income): Müşteriden para aldık -> Bakiye ARTAR (0'a yaklaşır)
                // Müşteri bakiyesi NEGATİF ise bize borçlu demek (-5000 gibi)
                // Tahsilat yapınca: -5000 + 5000 = 0
                if (type === 'income') {
                    customer.balance = Number(customer.balance) + Number(amount);
                } else {
                    // Müşteriye iade/ödeme yaptık -> Borç artar (daha negatif)
                    customer.balance = Number(customer.balance) - Number(amount);
                }
                await queryRunner.manager.save(customer);

            } else if (partyType === 'supplier') {
                const supplier = await queryRunner.manager.findOne(Supplier, { where: { id: partyId } });
                if (!supplier) throw new BadRequestException('Supplier not found');
                payment.partyName = supplier.name;

                // Ödeme (expense): Tedarikçiye para verdik -> Borcumuz azalır
                // Supplier bakiyesi + ise biz ona borçluyuz demek
                if (type === 'expense') {
                    supplier.balance = Number(supplier.balance) - Number(amount);
                } else {
                    // Tedarikçiden iade aldık -> Borcumuz artar
                    supplier.balance = Number(supplier.balance) + Number(amount);
                }
                await queryRunner.manager.save(supplier);
            }

            await queryRunner.manager.save(Payment, payment);
            await queryRunner.commitTransaction();
            return payment;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async getHistory() {
        return this.paymentRepo.find({ order: { date: 'DESC' } });
    }
}
