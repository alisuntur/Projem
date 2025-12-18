import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';
import { Customer } from '../customers/customer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Sale, Product, Customer])],
    controllers: [DashboardController],
    providers: [DashboardService]
})
export class DashboardModule { }
