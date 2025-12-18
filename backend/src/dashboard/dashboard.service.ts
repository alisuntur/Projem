import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale, SaleStatus } from '../sales/sale.entity';
import { Product } from '../products/product.entity';
import { Customer } from '../customers/customer.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { Payment } from '../finance/payment.entity';
import { Purchase } from '../purchases/purchase.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Sale) private saleRepo: Repository<Sale>,
        @InjectRepository(Product) private productRepo: Repository<Product>,
        @InjectRepository(Customer) private customerRepo: Repository<Customer>,
        @InjectRepository(Supplier) private supplierRepo: Repository<Supplier>,
        @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
        @InjectRepository(Purchase) private purchaseRepo: Repository<Purchase>,
    ) { }

    async getOverview() {
        // Time ranges
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const now = new Date();

        // 1. KPI: Monthly Revenue (Ciro)
        const monthlySales = await this.saleRepo.find({
            where: { date: Between(startOfMonth, now) }
        });
        const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);

        // 2. KPI: Pending Orders
        const pendingCount = await this.saleRepo.count({ where: { status: SaleStatus.PENDING } });

        // 3. KPI: Critical Stock
        const criticalStockCount = await this.productRepo
            .createQueryBuilder('product')
            .where('product.stock <= product.criticalLevel')
            .getCount();

        // 4. KPI: Customer Balance (Alacak) - Negative = they owe us
        const customers = await this.customerRepo.find();
        const totalCustomerBalance = customers.reduce((sum, c) => sum + Number(c.balance), 0);

        // 5. KPI: Supplier Balance (Borç) - Positive = we owe them
        const suppliers = await this.supplierRepo.find();
        const totalSupplierBalance = suppliers.reduce((sum, s) => sum + Number(s.balance), 0);

        // 6. KPI: Monthly Payments
        const monthlyPayments = await this.paymentRepo.find({
            where: { date: Between(startOfMonth, now) }
        });
        const totalIncome = monthlyPayments
            .filter(p => p.type === 'income')
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const totalExpense = monthlyPayments
            .filter(p => p.type === 'expense')
            .reduce((sum, p) => sum + Number(p.amount), 0);

        // 7. KPI: Monthly Purchases
        const monthlyPurchases = await this.purchaseRepo.find({
            where: { date: Between(startOfMonth, now) }
        });
        const totalPurchaseAmount = monthlyPurchases.reduce((sum, p) => sum + Number(p.totalAmount), 0);

        // 8. Customer count
        const customerCount = await this.customerRepo.count();

        // 9. Supplier count
        const supplierCount = await this.supplierRepo.count();

        // 10. Product count
        const productCount = await this.productRepo.count();

        // Chart: Last 7 Days Sales
        const last7Days: { name: string; uv: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

            const dayStart = new Date(d);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(d);
            dayEnd.setHours(23, 59, 59, 999);

            const salesInDay = await this.saleRepo.find({ where: { date: Between(dayStart, dayEnd) } });
            const value = salesInDay.reduce((sum, s) => sum + Number(s.totalAmount), 0);

            last7Days.push({ name: dateStr, uv: value });
        }

        // Chart: Brand Distribution (Top 5)
        const products = await this.productRepo.find();
        const brandMap: Record<string, number> = {};
        products.forEach(p => {
            const brand = p.brand || 'Diğer';
            brandMap[brand] = (brandMap[brand] || 0) + 1;
        });
        const brandData = Object.entries(brandMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => (b.value as number) - (a.value as number))
            .slice(0, 5);

        // Chart: Top 5 Suppliers by Balance (we owe them)
        const topSuppliers = suppliers
            .map(s => ({ name: s.name, value: Number(s.balance) }))
            .filter(s => s.value > 0)
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        // Chart: Top 5 Customers by Balance (they owe us, negative balance)
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
                customerBalance: totalCustomerBalance, // Negative = receivables
                supplierBalance: totalSupplierBalance, // Positive = payables
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
}

