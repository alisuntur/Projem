import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Purchase, PurchaseStatus } from './purchase.entity';
import { PurchaseItem } from './purchase-item.entity';
import { Product } from '../products/product.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { CreatePurchaseDto } from './create-purchase.dto';

@Injectable()
export class PurchasesService {
    constructor(
        @InjectRepository(Purchase)
        private purchasesRepository: Repository<Purchase>,
        @InjectRepository(Supplier)
        private supplierRepository: Repository<Supplier>,
        private dataSource: DataSource,
    ) { }

    async create(createPurchaseDto: CreatePurchaseDto) {
        // Use QueryRunner to ensure data consistency if we were doing more complex things, 
        // but for now standard repo access is fine, or we can look up products one by one.
        const { factoryName, items } = createPurchaseDto;

        const purchase = new Purchase();
        purchase.factoryName = factoryName;
        // purchase.status is defaulted to ORDERED in entity
        purchase.date = new Date();

        const purchaseItems: PurchaseItem[] = [];
        let totalAmount = 0;

        for (const itemDto of items) {
            // Fetch Product to get SKU
            const product = await this.dataSource.manager.findOne(Product, { where: { id: itemDto.productId } });

            if (!product) {
                // If product doesn't exist, we can't really order it by ID. 
                // For MVP, we throw error.
                throw new Error(`Product with ID ${itemDto.productId} not found`);
            }

            const purchaseItem = new PurchaseItem();
            purchaseItem.productId = itemDto.productId;
            purchaseItem.productSku = product.sku; // Get real SKU
            purchaseItem.quantity = itemDto.quantity;

            // purchaseItem.unitPrice = product.price * 0.7; 
            // Mock buying price (e.g. 70% of selling price)
            // Use provided unitPrice or default to 70% of Product Price
            if (itemDto.unitPrice !== undefined && itemDto.unitPrice !== null) {
                purchaseItem.unitPrice = itemDto.unitPrice;
            } else {
                purchaseItem.unitPrice = Number(product.price) * 0.7;
            }
            purchaseItem.totalPrice = purchaseItem.unitPrice * purchaseItem.quantity;

            purchaseItems.push(purchaseItem);
            totalAmount += purchaseItem.totalPrice;
        }

        purchase.items = purchaseItems;
        purchase.totalAmount = totalAmount;

        const savedPurchase = await this.purchasesRepository.save(purchase);

        // Update Supplier Balance (Borcumuz artar)
        // Find supplier by name
        const supplier = await this.supplierRepository.findOne({ where: { name: factoryName } });
        if (supplier) {
            supplier.balance = Number(supplier.balance) + Number(totalAmount);
            await this.supplierRepository.save(supplier);
        }

        return savedPurchase;
    }

    findAll() {
        return this.purchasesRepository.find({ relations: ['items'], order: { date: 'DESC' } });
    }

    // Method to receive goods and update stock
    async receivePurchase(id: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const purchase = await queryRunner.manager.findOne(Purchase, {
                where: { id },
                relations: ['items']
            });

            if (!purchase) throw new Error('Purchase not found');
            if (purchase.status === PurchaseStatus.RECEIVED) throw new Error('Already received');

            for (const item of purchase.items) {
                if (item.productId) {
                    const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });
                    if (product) {
                        product.stock += item.quantity;
                        await queryRunner.manager.save(product);
                    }
                }
            }

            purchase.status = PurchaseStatus.RECEIVED;
            await queryRunner.manager.save(purchase);

            await queryRunner.commitTransaction();
            return purchase;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async updateStatus(id: string, status: PurchaseStatus) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const purchase = await queryRunner.manager.findOne(Purchase, {
                where: { id },
                relations: ['items']
            });
            if (!purchase) throw new Error('Purchase not found');

            const oldStatus = purchase.status;
            const newStatus = status;

            // Scenario 1: Reverting FROM Received TO Something else (Decrease Stock)
            if (oldStatus === PurchaseStatus.RECEIVED && newStatus !== PurchaseStatus.RECEIVED) {
                for (const item of purchase.items) {
                    if (item.productId) {
                        const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });
                        if (product) {
                            product.stock -= item.quantity; // Decrease stock
                            await queryRunner.manager.save(product);
                        }
                    }
                }
            }
            // Scenario 2: Changing TO Received FROM Something else (Increase Stock)
            else if (oldStatus !== PurchaseStatus.RECEIVED && newStatus === PurchaseStatus.RECEIVED) {
                for (const item of purchase.items) {
                    if (item.productId) {
                        const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });
                        if (product) {
                            product.stock += item.quantity; // Increase stock
                            await queryRunner.manager.save(product);
                        }
                    }
                }
            }

            purchase.status = newStatus;
            const result = await queryRunner.manager.save(purchase);

            await queryRunner.commitTransaction();
            return result;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
