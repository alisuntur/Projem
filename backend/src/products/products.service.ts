import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
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
        return this.productsReposit