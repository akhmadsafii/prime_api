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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prime_service_1 = require("./prime.service");
let PrimeController = class PrimeController {
    prime;
    constructor(prime) {
        this.prime = prime;
    }
    health() {
        return this.prime.health();
    }
    panelSales(date, plant) {
        if (date && Number.isNaN(Date.parse(date))) {
            throw new common_1.BadRequestException('tgl must be a valid date');
        }
        return this.prime.panelSales(date, plant);
    }
    panelProduction(date, plant) {
        if (date && Number.isNaN(Date.parse(date)))
            throw new common_1.BadRequestException('tgl must be a valid date');
        return this.prime.panelProduction(date, plant);
    }
};
exports.PrimeController = PrimeController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PrimeController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('panel/sales/summary/stats'),
    __param(0, (0, common_1.Query)('tgl')),
    __param(1, (0, common_1.Query)('plant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PrimeController.prototype, "panelSales", null);
__decorate([
    (0, common_1.Get)('panel/production/get_data'),
    __param(0, (0, common_1.Query)('tgl')),
    __param(1, (0, common_1.Query)('plant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PrimeController.prototype, "panelProduction", null);
exports.PrimeController = PrimeController = __decorate([
    (0, swagger_1.ApiTags)('prime'),
    (0, common_1.Controller)('prime'),
    __metadata("design:paramtypes", [prime_service_1.PrimeService])
], PrimeController);
//# sourceMappingURL=prime.controller.js.map