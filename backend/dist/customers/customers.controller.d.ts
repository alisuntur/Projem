import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: Partial<Customer>): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findOne(id: string): Promise<Customer | null>;
    update(id: string, updateCustomerDto: Partial<Customer>): Promise<Customer | null>;
    getStatement(id: string): Promise<{
        customer: {
            id: number;
            name: string;
            balance: number;
        };
        transactions: any[];
    } | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
