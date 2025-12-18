import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Body() createProductDto: Partial<Product>) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAll(@Query('supplierId') supplierId?: string) {
        return this.productsService.findAll(supplierId ? +supplierId : undefined);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: Partial<Product>) {
        return this.productsService.update(+id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id);
    }
}
