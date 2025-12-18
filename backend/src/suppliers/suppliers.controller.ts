import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './supplier.entity';

@Controller('suppliers')
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) { }

    @Post()
    create(@Body() createSupplierDto: Partial<Supplier>) {
        return this.suppliersService.create(createSupplierDto);
    }

    @Get()
    findAll() {
        return this.suppliersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.suppliersService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSupplierDto: Partial<Supplier>) {
        return this.suppliersService.update(+id, updateSupplierDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.suppliersService.remove(+id);
    }

    @Post(':id/products/:productId')
    addProduct(@Param('id') id: string, @Param('productId') productId: string) {
        return this.suppliersService.addProductToSupplier(+id, +productId);
    }

    @Delete(':id/products/:productId')
    removeProduct(@Param('id') id: string, @Param('productId') productId: string) {
        return this.suppliersService.removeProductFromSupplier(+id, +productId);
    }
}
