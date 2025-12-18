"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchase = exports.PurchaseStatus = void 0;
const typeorm_1 = require("typeorm");
const purchase_item_entity_1 = require("./purchase-item.entity");
var PurchaseStatus;
(function (PurchaseStatus) {
    PurchaseStatus["ORDERED"] = "Sipari\u015F Verildi";
    PurchaseStatus["PRODUCING"] = "\u00DCretimde";
    PurchaseStatus["SHIPPED"] = "Yolda";
    PurchaseStatus["RECEIVED"] = "Teslim Al\u0131nd\u0131";
})(PurchaseStatus || (exports.PurchaseStatus = PurchaseStatus = {}));
let Purchase = class Purchase {
    id;
    factoryName;
    status;
    totalAmount;
    date;
    estimatedDeliveryDate;
    items;
};
exports.Purchase = Purchase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Purchase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Purchase.prototype, "factoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PurchaseStatus, default: PurchaseStatus.ORDERED }),
    __metadata("design:type", String)
], Purchase.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Purchase.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Purchase.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Purchase.prototype, "estimatedDeliveryDate", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_item_entity_1.PurchaseItem, (item) => item.purchase, { cascade: true }),
    __metadata("design:type", Array)
], Purchase.prototype, "items", void 0);
exports.Purchase = Purchase = __decorate([
    (0, typeorm_1.Entity)('purchases')
], Purchase);
//# sourceMappingURL=purchase.entity.js.map