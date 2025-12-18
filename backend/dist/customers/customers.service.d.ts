import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { Payment } from '../finance/payment.entity';
import { Sale } from '../sales/sale.entity';
export declare class CustomersService {
    private customersRepository;
    private paymentRepository;
    private saleRepository;
    constructor(customersRepository: Repository<Customer>, paymentRepository: Repository<Payment>, saleRepository: Repository<Sale>);
    create(createCustomerDto: Partial<Customer>): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findOne(id: number): Promise<Customer | null>;
    update(id: number, updateCustomerDto: Partial<Customer>): Promise<Customer | null>;
    getStatement(id: number): Promise<{
        customer: {
            id: number;
            name: string;
            balance: number;
        };
        transactions: any[];
    } | null>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}
