import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
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

    remove(id: number) {
        return this.customersRepository.delete(id);
    }
}
