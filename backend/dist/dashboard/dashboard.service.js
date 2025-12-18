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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("../sales/sale.entity");
const product_entity_1 = require("../products/product.entity");
const customer_entity_1 = require("../customers/customer.entity");
const supplier_entity_1 = require("../suppliers/supplier.entity");
const payment_entity_1 = require("../finance/payment.entity");
const purchase_entity_1 = require("../purchases/purchase.entity");
let DashboardService = class DashboardService {
    saleRepo;
    productRepo;
    customerRepo;
    supplierRepo;
    paymentRepo;
    purchaseRepo;
    constructor(saleRepo, productRepo, customerRepo, supplierRepo, paymentRepo, purchaseRepo) {
        this.saleRepo = saleRepo;
        this.productRepo = productRepo;
        this.customerRepo = customerRepo;
        this.supplierRepo = supplierRepo;
        this.paymentRepo = paymentRepo;
        this.purchaseRepo = purchaseRepo;
    }
    async getOverview() {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const now = new Date();
        const monthlySales = await this.saleRepo.find({
            where: { date: (0, typeorm_2.Between)(startOfMonth, now) }
        });
        const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
        const pendingCount = await this.saleRepo.count({ where: { status: sale_entity_1.SaleStatus.PENDING } });
        const criticalStockCount = await this.productRepo
            .createQueryBuilder('product')
            .where('product.stock <= product.criticalLevel')
            .getCount();
        const customers = await this.customerRepo.find();
        const totalCustomerBalance = customers.reduce((sum, c) => sum + Number(c.balance), 0);
        const suppliers = await this.supplierRepo.find();
        const totalSupplierBalance = suppliers.reduce((sum, s) => sum + Number(s.balance), 0);
        const monthlyPayments = await this.paymentRepo.find({
            where: { date: (0, typeorm_2.Between)(startOfMonth, now) }
        });
        const totalIncome = monthlyPayments
            .filter(p => p.type === 'income')
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const totalExpense = monthlyPayments
            .filter(p => p.type === 'expense')
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const monthlyPurchases = await this.purchaseRepo.find({
            where: { date: (0, typeorm_2.Between)(startOfMonth, now) }
        });
        const totalPurchaseAmount = monthlyPurchases.reduce((sum, p) => sum + Number(p.totalAmount), 0);
        const customerCount = await this.customerRepo.count();
        const supplierCount = await this.supplierRepo.count();
        const productCount = await this.productRepo.count();
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
            const dayStart = new Date(d);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(d);
            dayEnd.setHours(23, 59, 59, 999);
            const salesInDay = await this.saleRepo.find({ where: { date: (0, typeorm_2.Between)(dayStart, dayEnd) } });
            const value = salesInDay.reduce((sum, s) => sum + Number(s.totalAmount), 0);
            last7Days.push({ name: dateStr, uv: value });
        }
        const products = await this.productRepo.find();
        const brandMap = {};
        products.forEach(p => {
            const brand = p.brand || 'Diğer';
            brandMap[brand] = (brandMap[brand] || 0) + 1;
        });
        const brandData = Object.entries(brandMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
        const topSuppliers = suppliers
            .map(s => ({ name: s.name, value: Number(s.balance) }))
            .filter(s => s.value > 0)
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
        const topCustomers = customers
            .map(c => ({ name: c.name, value: Math.abs(Number(c.balance)) }))
            .filter(c => Number(c.value) > 0)
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
        return {
            kpi: {
                revenue: monthlyRevenue,
                pendingOrders: pendingCount,
                criticalStock: criticalStockCount,
                customerBalance: totalCustomerBalance,
                supplierBalance: totalSupplierBalance,
                totalIncome: totalIncome,
                totalExpense: totalExpense,
                totalPurchases: totalPurchaseAmount,
                customerCount,
                supplierCount,
                productCount
            },
            salesChart: last7Days,
            brandChart: brandData,
            topSuppliers,
            topCustomers
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(3, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(4, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(5, (0, typeorm_1.InjectRepository)(purchase_entity_1.Purchase)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map