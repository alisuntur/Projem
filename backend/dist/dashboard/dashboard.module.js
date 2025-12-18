"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboard_service_1 = require("./dashboard.service");
const sale_entity_1 = require("../sales/sale.entity");
const product_entity_1 = require("../products/product.entity");
const customer_entity_1 = require("../customers/customer.entity");
const supplier_entity_1 = require("../suppliers/supplier.entity");
const payment_entity_1 = require("../finance/payment.entity");
const purchase_entity_1 = require("../purchases/purchase.entity");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sale_entity_1.Sale, product_entity_1.Product, customer_entity_1.Customer, supplier_entity_1.Supplier, payment_entity_1.Payment, purchase_entity_1.Purchase])],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService]
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map