import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: Partial<Customer>): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findOne(id: string): Promise<Customer | null>;
    update(id: string, updateCustomerDto: Partial<Customer>): Promise<Customer | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
