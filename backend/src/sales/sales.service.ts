import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale, SaleStatus } from './sale.entity';
import { SaleItem } from './sale-item.entity';
import { Product } from '../products/product.entity';
import { Customer } from '../customers/customer.entity';
import { CreateSaleDto } from './create-sale.dto';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale)
        private salesRepository: Repository<Sale>,
        private dataSource: DataSource,
    ) { }

    async create(createSaleDto: CreateSaleDto) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { customerId, items, status } = createSaleDto;

            // 1. Create Sale Header
            const sale = new Sale();
            sale.customer = { id: customerId } as Customer;
            sale.status = status || SaleStatus.PREPARING;
            sale.date = new Date();

            // Calculate total amount
            let totalAmount = 0;
            const saleItems: SaleItem[] = [];

            // 2. Process Items and Deduct Stock
            for (const itemDto of items) {
                const product = await queryRunner.manager.findOne(Product, { where: { id: itemDto.productId } });

                if (!product) {
                    throw new BadRequestException(`Product with ID ${itemDto.productId} not found`);
                }

                if (product.stock < itemDto.quantity) {
                    throw new BadRequestException(`Insufficient stock for product ${product.name}. requested: ${itemDto.quantity}, available: ${product.stock}`);
                }

                // Deduct Stock
                product.stock -= itemDto.quantity;
                await queryRunner.manager.save(product);

                // Create Sale Item
                const saleItem = new SaleItem();
                saleItem.productId = product.id;
                saleItem.productName = product.name; // Snapshot name
                saleItem.quantity = itemDto.quantity;
                saleItem.unitPrice = product.price; // Use current price
                saleItem.totalPrice = product.price * itemDto.quantity;

                saleItems.push(saleItem);
                totalAmount += saleItem.totalPrice;
            }

            sale.totalAmount = totalAmount;
            sale.items = saleItems;

            // 3. Save Sale (Cascade will save items)
            const savedSale = await queryRunner.manager.save(Sale, sale);

            // 4. Update Customer Balance (Optional: Add sale amount to debt?)
            if (customerId) {
                const customer = await queryRunner.manager.findOne(Customer, { where: { id: customerId } });
                if (customer) {
                    customer.balance = Number(customer.balance) - Number(totalAmount); // Negative balance means debt in this context? Or positive? 
                    // Usually: Debt is Positive, Credit is Negative OR
                    // Balance: Current money they have. If they buy on credit, balance decreases. 
                    // Let's assume Balance = Account Balance. Buying reduces it (making it more negative if they owe money).
                    await queryRunner.manager.save(customer);
                }
            }

            await queryRunner.commitTransaction();
            return savedSale;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    findAll() {
        return this.salesRepository.find({
            relations: ['items', 'customer'],
            order: { date: 'DESC' }
        });
    }

    findOne(id: string) {
        return this.salesRepository.findOne({
            where: { id },
            relations: ['items', 'customer']
        });
    }
}
