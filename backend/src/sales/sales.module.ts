import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './sale.entity';
import { SaleItem } from './sale-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleItem])],
  providers: [SalesService],
  controllers: [SalesController]
})
export class SalesModule { }
