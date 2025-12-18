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
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_entity_1 = require("./purchase.entity");
const purchase_item_entity_1 = require("./purchase-item.entity");
const product_entity_1 = require("../products/product.entity");
const supplier_entity_1 = require("../suppliers/supplier.entity");
let PurchasesService = class PurchasesService {
    purchasesRepository;
    supplierRepository;
    dataSource;
    constructor(purchasesRepository, supplierRepository, dataSource) {
        this.purchasesRepository = purchasesRepository;
        this.supplierRepository = supplierRepository;
        this.dataSource = dataSource;
    }
    async create(createPurchaseDto) {
        const { factoryName, items } = createPurchaseDto;
        const purchase = new purchase_entity_1.Purchase();
        purchase.factoryName = factoryName;
        purchase.date = new Date();
        const purchaseItems = [];
        let totalAmount = 0;
        for (const itemDto of items) {
            const product = await this.dataSource.manager.findOne(product_entity_1.Product, { where: { id: itemDto.productId } });
            if (!product) {
                throw new Error(`Product with ID ${itemDto.productId} not found`);
            }
            const purchaseItem = new purchase_item_entity_1.PurchaseItem();
            purchaseItem.productId = itemDto.productId;
            purchaseItem.productSku = product.sku;
            purchaseItem.quantity = itemDto.quantity;
            if (itemDto.unitPrice !== undefined && itemDto.unitPrice !== null) {
                purchaseItem.unitPrice = itemDto.unitPrice;
            }
            else {
                purchaseItem.unitPrice = Number(product.price) * 0.7;
            }
            purchaseItem.totalPrice = purchaseItem.unitPrice * purchaseItem.quantity;
            purchaseItems.push(purchaseItem);
            totalAmount += purchaseItem.totalPrice;
        }
        purchase.items = purchaseItems;
        purchase.totalAmount = totalAmount;
        const savedPurchase = await this.purchasesRepository.save(purchase);
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
    findOne(id) {
        return this.purchasesRepository.findOne({ where: { id }, relations: ['items'] });
    }
    async update(id, updateData) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const purchase = await queryRunner.manager.findOne(purchase_entity_1.Purchase, {
                where: { id },
                relations: ['items']
            });
            if (!purchase)
                throw new Error('Purchase not found');
            if (updateData.items && Array.isArray(updateData.items)) {
                let newTotal = 0;
                for (const itemUpdate of updateData.items) {
                    const existingItem = purchase.items.find(i => i.id === itemUpdate.id);
                    if (existingItem) {
                        existingItem.quantity = itemUpdate.quantity ?? existingItem.quantity;
                        existingItem.unitPrice = itemUpdate.unitPrice ?? existingItem.unitPrice;
                        existingItem.totalPrice = Number(existingItem.unitPrice) * Number(existingItem.quantity);
                        await queryRunner.manager.save(existingItem);
                        newTotal += existingItem.totalPrice;
                    }
                }
                purchase.totalAmount = newTotal;
            }
            if (updateData.factoryName) {
                purchase.factoryName = updateData.factoryName;
            }
            await queryRunner.manager.save(purchase);
            await queryRunner.commitTransaction();
            return this.findOne(id);
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async receivePurchase(id) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const purchase = await queryRunner.manager.findOne(purchase_entity_1.Purchase, {
                where: { id },
                relations: ['items']
            });
            if (!purchase)
                throw new Error('Purchase not found');
            if (purchase.status === purchase_entity_1.PurchaseStatus.RECEIVED)
                throw new Error('Already received');
            for (const item of purchase.items) {
                if (item.productId) {
                    const product = await queryRunner.manager.findOne(product_entity_1.Product, { where: { id: item.productId } });
                    if (product) {
                        product.stock += item.quantity;
                        await queryRunner.manager.save(product);
                    }
                }
            }
            purchase.status = purchase_entity_1.PurchaseStatus.RECEIVED;
            await queryRunner.manager.save(purchase);
            await queryRunner.commitTransaction();
            return purchase;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateStatus(id, status) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const purchase = await queryRunner.manager.findOne(purchase_entity_1.Purchase, {
                where: { id },
                relations: ['items']
            });
            if (!purchase)
                throw new Error('Purchase not found');
            const oldStatus = purchase.status;
            const newStatus = status;
            if (oldStatus === purchase_entity_1.PurchaseStatus.RECEIVED && newStatus !== purchase_entity_1.PurchaseStatus.RECEIVED) {
                for (const item of purchase.items) {
                    if (item.productId) {
                        const product = await queryRunner.manager.findOne(product_entity_1.Product, { where: { id: item.productId } });
                        if (product) {
                            product.stock -= item.quantity;
                            await queryRunner.manager.save(product);
                        }
                    }
                }
            }
            else if (oldStatus !== purchase_entity_1.PurchaseStatus.RECEIVED && newStatus === purchase_entity_1.PurchaseStatus.RECEIVED) {
                for (const item of purchase.items) {
                    if (item.productId) {
                        const product = await queryRunner.manager.findOne(product_entity_1.Product, { where: { id: item.productId } });
                        if (product) {
                            product.stock += item.quantity;
                            await queryRunner.manager.save(product);
                        }
                    }
                }
            }
            purchase.status = newStatus;
            const result = await queryRunner.manager.save(purchase);
            await queryRunner.commitTransaction();
            return result;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_entity_1.Purchase)),
    __param(1, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map