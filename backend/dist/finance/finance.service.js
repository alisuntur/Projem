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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./payment.entity");
const customer_entity_1 = require("../customers/customer.entity");
const supplier_entity_1 = require("../suppliers/supplier.entity");
let FinanceService = class FinanceService {
    paymentRepo;
    customerRepo;
    supplierRepo;
    dataSource;
    constructor(paymentRepo, customerRepo, supplierRepo, dataSource) {
        this.paymentRepo = paymentRepo;
        this.customerRepo = customerRepo;
        this.supplierRepo = supplierRepo;
        this.dataSource = dataSource;
    }
    async getStats() {
        const customers = await this.customerRepo.find();
        const suppliers = await this.supplierRepo.find();
        const totalReceivables = customers.reduce((sum, c) => sum + Number(c.balance), 0);
        const totalPayables = suppliers.reduce((sum, s) => sum + Number(s.balance), 0);
        return {
            totalReceivables,
            totalPayables
        };
    }
    async addPayment(dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { type, partyType, partyId, amount, method, description } = dto;
            const payment = new payment_entity_1.Payment();
            payment.type = type;
            payment.partyType = partyType;
            payment.partyId = partyId;
            payment.amount = amount;
            payment.method = method;
            payment.description = description;
            if (partyType === 'customer') {
                const customer = await queryRunner.manager.findOne(customer_entity_1.Customer, { where: { id: partyId } });
                if (!customer)
                    throw new common_1.BadRequestException('Customer not found');
                payment.partyName = customer.name;
                if (type === payment_entity_1.PaymentType.INCOME) {
                    customer.balance = Number(customer.balance) - Number(amount);
                }
                else {
                    customer.balance = Number(customer.balance) + Number(amount);
                }
                await queryRunner.manager.save(customer);
            }
            else if (partyType === 'supplier') {
                const supplier = await queryRunner.manager.findOne(supplier_entity_1.Supplier, { where: { id: partyId } });
                if (!supplier)
                    throw new common_1.BadRequestException('Supplier not found');
                payment.partyName = supplier.name;
                if (type === payment_entity_1.PaymentType.EXPENSE) {
                    supplier.balance = Number(supplier.balance) - Number(amount);
                }
                else {
                    supplier.balance = Number(supplier.balance) + Number(amount);
                }
                await queryRunner.manager.save(supplier);
            }
            await queryRunner.manager.save(payment_entity_1.Payment, payment);
            await queryRunner.commitTransaction();
            return payment;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getHistory() {
        return this.paymentRepo.find({ order: { date: 'DESC' } });
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(2, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], FinanceService);
//# sourceMappingURL=finance.service.js.map