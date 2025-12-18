import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { Payment } from '../finance/payment.entity';
import { Sale } from '../sales/sale.entity';

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

    async remove(id: number) {
        // 1. Delete related payments
        await this.paymentRepository.delete({ partyType: 'customer', partyId: id });

        // 2. Delete related sales (This will delete sale items via cascade if configured or we delete them explicitly if not)
        // Since Sale -> SaleItem has Cascade, deleting Sale is enough.
        await this.saleRepository.delete({ customer: { id } });

        // 3. Delete customer
        return this.customersRepository.delete(id);
    }
}
