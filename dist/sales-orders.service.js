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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sales_order_entity_1 = require("./entities/sales-order.entity");
const product_entity_1 = require("../products/entities/product.entity");
const sales_order_detail_entity_1 = require("./entities/sales-order-detail.entity");
let SalesOrdersService = class SalesOrdersService {
    soRepository;
    productRepository;
    dataSource;
    constructor(soRepository, productRepository, dataSource) {
        this.soRepository = soRepository;
        this.productRepository = productRepository;
        this.dataSource = dataSource;
    }
    async create(dto) {
        return this.dataSource.transaction(async (transactionalEntityManager) => {
            const order = new sales_order_entity_1.SalesOrder();
            order.customerName = dto.customerName;
            order.orderDate = new Date(dto.orderDate);
            order.orderNumber = `SO-${Date.now()}`;
            order.details = [];
            let totalAmount = 0;
            for (const itemDto of dto.items) {
                const product = await transactionalEntityManager.findOneBy(product_entity_1.Product, { id: itemDto.productId });
                if (!product) {
                    throw new common_1.NotFoundException(`Product with ID ${itemDto.productId} not found.`);
                }
                const detail = new sales_order_detail_entity_1.SalesOrderDetail();
                detail.product = product;
                detail.quantity = itemDto.quantity;
                detail.pricePerUnit = product.price;
                detail.subtotal = itemDto.quantity * product.price;
                order.details.push(detail);
                totalAmount += detail.subtotal;
            }
            order.totalAmount = totalAmount;
            return transactionalEntityManager.save(order);
        });
    }
    async findAll(page = 1, limit = 10, search = '') {
        const [data, total] = await this.soRepository.findAndCount({
            where: search
                ? [{ orderNumber: (0, typeorm_2.ILike)(`%${search}%`) }, { customerName: (0, typeorm_2.ILike)(`%${search}%`) }]
                : {},
            relations: { details: true },
            order: { orderDate: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
        });
        return { data, total };
    }
    async findOne(id) {
        const order = await this.soRepository.findOne({
            where: { id },
            relations: { details: { product: true } },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Sales Order with ID "${id}" not found`);
        }
        return order;
    }
    async update(id, dto) {
        const order = await this.soRepository.preload({
            id: id,
            status: dto.status,
        });
        if (!order) {
            throw new common_1.NotFoundException(`Sales Order with ID "${id}" not found`);
        }
        return this.soRepository.save(order);
    }
    async remove(id) {
        const result = await this.soRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Sales Order with ID "${id}" not found`);
        }
    }
};
exports.SalesOrdersService = SalesOrdersService;
exports.SalesOrdersService = SalesOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sales_order_entity_1.SalesOrder)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _c : Object])
], SalesOrdersService);
//# sourceMappingURL=sales-orders.service.js.map