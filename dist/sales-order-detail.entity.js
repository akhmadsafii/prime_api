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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderDetail = void 0;
const typeorm_1 = require("typeorm");
const sales_order_entity_1 = require("./sales-order.entity");
const product_entity_1 = require("../../products/entities/product.entity");
let SalesOrderDetail = class SalesOrderDetail {
    id;
    salesOrder;
    product;
    quantity;
    pricePerUnit;
    subtotal;
};
exports.SalesOrderDetail = SalesOrderDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SalesOrderDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_order_entity_1.SalesOrder, (order) => order.details, { onDelete: 'CASCADE' }),
    __metadata("design:type", sales_order_entity_1.SalesOrder)
], SalesOrderDetail.prototype, "salesOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { eager: true }),
    __metadata("design:type", typeof (_a = typeof product_entity_1.Product !== "undefined" && product_entity_1.Product) === "function" ? _a : Object)
], SalesOrderDetail.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SalesOrderDetail.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SalesOrderDetail.prototype, "pricePerUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SalesOrderDetail.prototype, "subtotal", void 0);
exports.SalesOrderDetail = SalesOrderDetail = __decorate([
    (0, typeorm_1.Entity)('sales_order_details')
], SalesOrderDetail);
//# sourceMappingURL=sales-order-detail.entity.js.map