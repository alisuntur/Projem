import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Customer } from './customer.entity';
import { Payment } from '../finance/payment.entity';
import { Sale } from '../sales/sale.entity';
import { SaleItem } from '../sales/sale-item.entity';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(Sale)
        private saleRepository: Repository<Sale>,
    ) { }

    create(createCustomerDto: Partial<Customer>) {
        const customer = this.customersRepository.create(createCustomerDto);
        return this.customersRepository.save(customer);
    }

    findAll() {
        return this.customersRepository.find({ order: { createdAt: 'DESC' } });
    }

    findOne(id: number) {
        return this.customersRepository.findOneBy({ id });
    }

    async update(id: number, updateCustomerDto: Partial<Customer>) {
        await this.customersRepository.update(id, updateCustomerDto);
        return this.findOne(id);
    }

    async getStatement(id: number) {
        const customer = await this.customersRepository.findOneBy({ id });
        if (!customer) return null;

        // Get sales for this customer
        const sales = await this.saleRepository.find({
            where: { customer: { id } },
            order: { date: 'DESC' },
            relations: ['items']
        });

        // Get payments for this customer
        const payments = await this.paymentRepository.find({
            where: { partyType: 'customer', partyId: id },
            order: { date: 'DESC' }
        });

        // Combine and sort transactions
        const transactions: any[] = [];

        for (const sale of sales) {
            transactions.push({
                id: sale.id,
                type: 'sale',
                date: sale.date,
                description: `Sipariş #${sale.id.substring(0, 8)}`,
                amount: Number(sale.totalAmount),
                debit: Number(sale.totalAmount), // Borç (negatif etki)
                credit: 0
            });
        }

        for (const payment of payments) {
            transactions.push({
                id: `PAY-${payment.id}`,
                type: payment.type === 'income' ? 'payment' : 'refund',
                date: payment.date,
                description: payment.description || (payment.type === 'income' ? 'Tahsilat' : 'İade'),
                amount: Number(payment.amount),
                debit: payment.type === 'income' ? 0 : Number(payment.amount),
                credit: payment.type === 'income' ? Number(payment.amount) : 0
            });
        }

        // Sort by date descending
        transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Calculate running balance
        let runningBalance = 0;
        const transactionsWithBalance = [...transactions].reverse().map(trx => {
            if (trx.type === 'sale') {
                runningBalance -= trx.amount; // Sale decreases balance (more negative)
            } else if (trx.type === 'payment') {
                runningBalance += trx.amount; // Payment increases balance (towards 0)
            } else {
                runningBalance -= trx.amount; // Refund decreases balance
            }
            return { ...trx, balance: runningBalance };
        }).reverse();

        return {
            customer: {
                id: customer.id,
                name: customer.name,
                balance: customer.balance
            },
            transactions: transactionsWithBalance
        };
    }

    async remove(id: number) {
        // NUCLEAR OPTION: Raw SQL to bypass all ORM checks
        const queryRunner = this.customersRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            console.log(`Deleting customer ${id} with RAW SQL...`);

            // 1. Delete Sale Items linked to Sales of this Customer
            await queryRunner.query(`
                DELETE FROM sale_items 
                WHERE "sale_id" IN (SELECT id FROM sales WHERE "customer_id" = $1)
            `, [id]);

            // 2. Delete Sales
            await queryRunner.query(`DELETE FROM sales WHERE "customer_id" = $1`, [id]);

            // 3. Delete Payments
            // Note: partyId is integer, partyType is string
            await queryRunner.query(`DELETE FROM payments WHERE "partyId" = $1 AND "partyType" = 'customer'`, [id]);

            // 4. Delete Customer
            await queryRunner.query(`DELETE FROM customers WHERE id = $1`, [id]);

            await queryRunner.commitTransaction();
            console.log(`Customer ${id} deleted successfully.`);
            return { deleted: true };
        } catch (err) {
            console.error('NUCLEAR DELETE ERROR:', err);
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
