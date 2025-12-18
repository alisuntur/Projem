import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
export declare class CustomersService {
    private customersRepository;
    constructor(customersRepository: Repository<Customer>);
    create(createCustomerDto: Partial<Customer>): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findOne(id: number): Promise<Customer | null>;
    update(id: number, updateCustomerDto: Partial<Customer>): Promise<Customer | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
