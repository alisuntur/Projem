import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';
import { Customer } from '../customers/customer.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { Payment } from '../finance/payment.entity';
import { Purchase } from '../purchases/purchase.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Sale, Product, Customer, Supplier, Payment, Purchase])],
    controllers: [DashboardController],
    providers: [DashboardService]
})
export class DashboardModule { }
