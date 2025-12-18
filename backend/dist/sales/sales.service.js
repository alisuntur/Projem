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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("./sale.entity");
const sale_item_entity_1 = require("./sale-item.entity");
const product_entity_1 = require("../products/product.entity");
const customer_entity_1 = require("../customers/customer.entity");
let SalesService = class SalesService {
    salesRepository;
    dataSource;
    constructor(salesRepository, dataSource) {
        this.salesRepository = salesRepository;
        this.dataSource = dataSource;
    }
    async create(createSaleDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { customerId, items, status } = createSaleDto;
            const sale = new sale_entity_1.Sale();
            sale.customer = { id: customerId };
            sale.status = status || sale_entity_1.SaleStatus.PREPARING;
            sale.date = new Date();
            let totalAmount = 0;
            const saleItems = [];
            for (const itemDto of items) {
                const product = await queryRunner.manager.findOne(product_entity_1.Product, { where: { id: itemDto.productId } });
                if (!product) {
                    throw new common_1.BadRequestException(`Product with ID ${itemDto.productId} not found`);
                }
                if (product.stock < itemDto.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for product ${product.name}. requested: ${itemDto.quantity}, available: ${product.stock}`);
                }
                product.stock -= itemDto.quantity;
                await queryRunner.manager.save(product);
                const saleItem = new sale_item_entity_1.SaleItem();
                saleItem.productId = product.id;
                saleItem.productName = product.name;
                saleItem.quantity = itemDto.quantity;
                saleItem.unitPrice = product.price;
                saleItem.totalPrice = product.price * itemDto.quantity;
                saleItems.push(saleItem);
                totalAmount += saleItem.totalPrice;
            }
            sale.totalAmount = totalAmount;
            sale.items = saleItems;
            const savedSale = await queryRunner.manager.save(sale_entity_1.Sale, sale);
            if (customerId) {
                const customer = await queryRunner.manager.findOne(customer_entity_1.Customer, { where: { id: customerId } });
                if (customer) {
                    customer.balance = Number(customer.balance) - Number(totalAmount);
                    await queryRunner.manager.save(customer);
                }
            }
            await queryRunner.commitTransaction();
            return savedSale;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    findAll() {
        return this.salesRepository.find({
            relations: ['items', 'customer'],
            order: { date: 'DESC' }
        });
    }
    findOne(id) {
        return this.salesRepository.findOne({
            where: { id },
            relations: ['items', 'customer']
        });
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], SalesService);
//# sourceMappingURL=sales.service.js.map