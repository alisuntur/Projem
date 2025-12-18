"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductsService = class ProductsService {
    productsRepository;
    dataSource;
    constructor(productsRepository, dataSource) {
        this.productsRepository = productsRepository;
        this.dataSource = dataSource;
    }
    create(createProductDto) {
        const product = this.productsRepository.create(createProductDto);
        return this.productsRepository.save(product);
    }
    findAll(supplierId) {
        if (supplierId) {
            return this.productsRepository.createQueryBuilder('product')
                .innerJoinAndSelect('product.suppliers', 'supplier', 'supplier.id = :supplierId', { supplierId })
                .getMany();
        }
        return this.productsRepository.find({ relations: ['suppliers'], order: { name: 'ASC' } });
    }
    findOne(id) {
        return this.productsRepository.findOneBy({ id });
    }
    async update(id, updateProductDto) {
        await this.productsRepository.update(id, updateProductDto);
        return this.findOne(id);
    }
    async remove(id) {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product)
            return { deleted: false };
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`DELETE FROM supplier_products WHERE "productId" = $1`, [id]);
            await queryRunner.query(`DELETE FROM sale_items WHERE "productId" = $1`, [id]);
            await queryRunner.query(`DELETE FROM purchase_items WHERE "productId" = $1`, [id]);
            await queryRunner.query(`DELETE FROM products WHERE id = $1`, [id]);
            await queryRunner.commitTransaction();
            return { deleted: true };
        }
        catch (err) {
            console.error('PRODUCT DELETE ERROR:', err);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], ProductsService);
//# sourceMappingURL=products.service.js.map