"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const suppliers_service_1 = require("./suppliers.service");
const suppliers_controller_1 = require("./suppliers.controller");
const supplier_entity_1 = require("./supplier.entity");
const product_entity_1 = require("../products/product.entity");
const payment_entity_1 = require("../finance/payment.entity");
const purchase_entity_1 = require("../purchases/purchase.entity");
let SuppliersModule = class SuppliersModule {
};
exports.SuppliersModule = SuppliersModule;
exports.SuppliersModule = SuppliersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([supplier_entity_1.Supplier, product_entity_1.Product, payment_entity_1.Payment, purchase_entity_1.Purchase])],
        controllers: [suppliers_controller_1.SuppliersController],
        providers: [suppliers_service_1.SuppliersService],
        exports: [suppliers_service_1.SuppliersService]
    })
], SuppliersModule);
//# sourceMappingURL=suppliers.module.js.map