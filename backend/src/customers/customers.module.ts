import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './customer.entity';
import { Payment } from '../finance/payment.entity';

import { Sale } from '../sales/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Payment, Sale])],
  providers: [CustomersService],
  controllers: [CustomersController],
})
export class CustomersModule { }
