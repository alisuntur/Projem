import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { Supplier } from './supplier.entity';
import { Product } from '../products/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Supplier, Product])],
    controllers: [SuppliersController],
    providers: [SuppliersService],
    exports: [SuppliersService]
})
export class SuppliersModule { }
