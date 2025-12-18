import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { Purchase } from './purchase.entity';
import { PurchaseItem } from './purchase-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase, PurchaseItem])],
  providers: [PurchasesService],
  controllers: [PurchasesController],
})
export class PurchasesModule { }
