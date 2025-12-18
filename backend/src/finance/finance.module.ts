import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { Payment } from './payment.entity';
import { Customer } from '../customers/customer.entity';
import { Supplier } from '../suppliers/supplier.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, Customer, Supplier])],
    controllers: [FinanceController],
    providers: [FinanceService]
})
export class FinanceModule { }
