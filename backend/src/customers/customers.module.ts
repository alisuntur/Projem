import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './customer.entity';
import { Payment } from '../finance/payment.entity';

import { Sale } from '../sales/sale.entity';
import { SaleItem } from '../sales/sale-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Payment, Sale, SaleItem])],
  providers: [CustomersService],
  controllers: [CustomersController],
})
export class CustomersModule { }
