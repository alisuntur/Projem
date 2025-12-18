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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const supplier_entity_1 = require("./supplier.entity");
const product_entity_1 = require("../products/product.entity");
let SuppliersService = class SuppliersService {
    suppliersRepository;
    productsRepository;
    constructor(suppliersRepository, productsRepository) {
        this.suppliersRepository = suppliersRepository;
        this.productsRepository = productsRepository;
    }
    create(createSupplierDto) {
        const supplier = this.suppliersRepository.create(createSupplierDto);
        return this.suppliersRepository.save(supplier);
    }
    findAll() {
        return this.suppliersRepository.find({ relations: ['products'] });
    }
    findOne(id) {
        return this.suppliersRepository.findOne({ where: { id }, relations: ['products'] });
    }
    update(id, updateSupplierDto) {
        return this.suppliersRepository.update(id, updateSupplierDto);
    }
    remove(id) {
        return this.suppliersRepository.delete(id);
    }
    async addProductToSupplier(supplierId, productId) {
        const supplier = await this.suppliersRepository.findOne({ where: { id: supplierId }, relations: ['products'] });
        const product = await this.productsRepository.findOne({ where: { id: productId } });
        if (supplier && product) {
            supplier.products.push(product);
            return this.suppliersRepository.save(supplier);
        }
        return null;
    }
    async removeProductFromSupplier(supplierId, productId) {
        const supplier = await this.suppliersRepository.findOne({ where: { id: supplierId }, relations: ['products'] });
        if (supplier) {
            supplier.products = supplier.products.filter(p => p.id !== productId);
            return this.suppliersRepository.save(supplier);
        }
        return null;
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map