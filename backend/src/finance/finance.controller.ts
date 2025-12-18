import { Controller, Get, Post, Body } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
    constructor(private service: FinanceService) { }

    @Get('stats')
    getStats() {
        return this.service.getStats();
    }

    @Get('history')
    getHistory() {
        return this.service.getHistory();
    }

    @Post('payment')
    addPayment(@Body() body: any) {
        return this.service.addPayment(body);
    }
}
