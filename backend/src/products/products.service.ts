import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private dataSource: DataSource,
    ) { }

    create(createProductDto: Partial<Product>) {
        const product = this.productsRepository.create(createProductDto);
        return this.productsRepository.save(product);
    }

    findAll(supplierId?: number) {
        if (supplierId) {
            return this.productsRepository.createQueryBuilder('product')
                .innerJoinAndSelect('product.suppliers', 'supplier', 'supplier.id = :supplierId', { supplierId })
                .getMany();
        }
        return this.productsRepository.find({ relations: ['suppliers'], order: { name: 'ASC' } });
    }

    findOne(id: number) {
        return this.productsRepository.findOneBy({ id });
    }

    async update(id: number, updateProductDto: Partial<Product>) {
        await this.productsRepository.update(id, updateProductDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) return { deleted: false };

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Remove product-supplier relations (junction table)
            await queryRunner.query(`DELETE FROM supplier_products WHERE "productId" = $1`, [id]);

            // 2. Delete related sale_items (by product id)
            await queryRunner.query(`DELETE FROM sale_items WHERE "productId" = $1`, [id]);

            // 3. Delete related purchase_items (by product id)
            await queryRunner.query(`DELETE FROM purchase_items WHERE "productId" = $1`, [id]);

            // 4. Delete the product
            await queryRunner.query(`DELETE FROM products WHERE id = $1`, [id]);

            await queryRunner.commitTransaction();
            return { deleted: true };
        } catch (err) {
            console.error('PRODUCT DELETE ERROR:', err);
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}

