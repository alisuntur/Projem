import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale, SaleStatus } from '../sales/sale.entity';
import { Product } from '../products/product.entity';
import { Customer } from '../customers/customer.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Sale) private saleRepo: Repository<Sale>,
        @InjectRepository(Product) private productRepo: Repository<Product>,
        @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    ) { }

    async getOverview() {
        // 1. KPI: Monthly Revenue (Ciro)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlySales = await this.saleRepo.find({
            where: { date: Between(startOfMonth, new Date()) }
        });
        const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);

        // 2. KPI: Pending Orders
        const pendingCount = await this.saleRepo.count({ where: { status: SaleStatus.PENDING } });

        // 3. KPI: Critical Stock
        const criticalStockCount = await this.productRepo
            .createQueryBuilder('product')
            .where('product.stock <= product.criticalLevel')
            .getCount();

        // 4. KPI: Total Balance (Alacak/Verecek)
        const customers = await this.customerRepo.find();
        const totalBalance = customers.reduce((sum, c) => sum + Number(c.balance), 0);

        // 5. Chart: Last 7 Days Sales
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

        // 6. Chart: Brand Distribution (Top 5)
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

        return {
            kpi: {
                revenue: monthlyRevenue,
                pendingOrders: pendingCount,
                criticalStock: criticalStockCount,
                balance: totalBalance
            },
            salesChart: last7Days,
            brandChart: brandData
        };
    }
}
