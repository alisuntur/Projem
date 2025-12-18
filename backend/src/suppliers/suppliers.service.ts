import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { Product } from '../products/product.entity';
import { Payment } from '../finance/payment.entity';
import { Purchase } from '../purchases/purchase.entity';

@Injectable()
export class SuppliersService {
    constructor(
        @InjectRepository(Supplier)
        private suppliersRepository: Repository<Supplier>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(Purchase)
        private purchaseRepository: Repository<Purchase>,
    ) { }

    create(createSupplierDto: Partial<Supplier>) {
        const supplier = this.suppliersRepository.create(createSupplierDto);
        return this.suppliersRepository.save(supplier);
    }

    findAll() {
        return this.suppliersRepository.find({ relations: ['products'] });
    }

    findOne(id: number) {
        return this.suppliersRepository.findOne({ where: { id }, relations: ['products'] });
    }

    update(id: number, updateSupplierDto: Partial<Supplier>) {
        return this.suppliersRepository.update(id, updateSupplierDto);
    }

    async remove(id: number) {
        // Get supplier name first for purchase deletion
        const supplier = await this.suppliersRepository.findOneBy({ id });
        if (!supplier) return { deleted: false };

        const queryRunner = this.suppliersRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Delete related payments
            await queryRunner.query(`DELETE FROM payments WHERE "partyId" = $1 AND "partyType" = 'supplier'`, [id]);

            // 2. Delete related purchase items (by factoryName)
            await queryRunner.query(`
                DELETE FROM purchase_items 
                WHERE "purchase_id" IN (SELECT id FROM purchases WHERE "factoryName" = $1)
            `, [supplier.name]);

            // 3. Delete related purchases
            await queryRunner.query(`DELETE FROM purchases WHERE "factoryName" = $1`, [supplier.name]);

            // 4. Delete supplier
            await queryRunner.query(`DELETE FROM suppliers WHERE id = $1`, [id]);

            await queryRunner.commitTransaction();
            return { deleted: true };
        } catch (err) {
            console.error('SUPPLIER DELETE ERROR:', err);
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async addProductToSupplier(supplierId: number, productId: number) {
        const supplier = await this.suppliersRepository.findOne({ where: { id: supplierId }, relations: ['products'] });
        const product = await this.productsRepository.findOne({ where: { id: productId } });

        if (supplier && product) {
            supplier.products.push(product);
            return this.suppliersRepository.save(supplier);
        }
        return null;
    }

    async removeProductFromSupplier(supplierId: number, productId: number) {
        const supplier = await this.suppliersRepository.findOne({ where: { id: supplierId }, relations: ['products'] });

        if (supplier) {
            supplier.products = supplier.products.filter(p => p.id !== productId);
            return this.suppliersRepository.save(supplier);
        }
        return null;
    }
}
