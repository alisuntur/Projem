import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './create-purchase.dto';
import { PurchaseStatus } from './purchase.entity';

@Controller('purchases')
export class PurchasesController {
    constructor(private readonly purchasesService: PurchasesService) { }

    @Post()
    create(@Body() createPurchaseDto: CreatePurchaseDto) {
        return this.purchasesService.create(createPurchaseDto);
    }

    @Get()
    findAll() {
        return this.purchasesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.purchasesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateData: any) {
        return this.purchasesService.update(id, updateData);
    }

    @Patch(':id/receive')
    receive(@Param('id') id: string) {
        return this.purchasesService.receivePurchase(id);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: PurchaseStatus) {
        return this.purchasesService.updateStatus(id, status);
    }
}
