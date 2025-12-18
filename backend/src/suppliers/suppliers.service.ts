import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class SuppliersService {
    constructor(
        @InjectRepository(Supplier)
        private suppliersRepository: Repository<Supplier>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
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

    remove(id: number) {
        return this.suppliersRepository.delete(id);
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
