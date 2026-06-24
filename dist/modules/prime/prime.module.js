"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimeModule = void 0;
const common_1 = require("@nestjs/common");
const prime_controller_1 = require("./prime.controller");
const prime_service_1 = require("./prime.service");
const prime_sales_service_1 = require("./sales/prime-sales.service");
let PrimeModule = class PrimeModule {
};
exports.PrimeModule = PrimeModule;
exports.PrimeModule = PrimeModule = __decorate([
    (0, common_1.Module)({
        controllers: [prime_controller_1.PrimeController],
        providers: [prime_service_1.PrimeService, prime_sales_service_1.PrimeSalesService],
    })
], PrimeModule);
//# sourceMappingURL=prime.module.js.map