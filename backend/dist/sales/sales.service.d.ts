import { Repository, DataSource } from 'typeorm';
import { Sale } from './sale.entity';
import { CreateSaleDto } from './create-sale.dto';
export declare class SalesService {
    private salesRepository;
    private dataSource;
    constructor(salesRepository: Repository<Sale>, dataSource: DataSource);
    create(createSaleDto: CreateSaleDto): Promise<Sale>;
    findAll(page?: number, limit?: number, search?: string, status?: string): Promise<{
        data: Sale[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateStatus(id: string, status: string): Promise<Sale>;
    findOne(id: string): Promise<Sale | null>;
}
