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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const clickhouse_service_1 = require("../../infrastructure/clickhouse/clickhouse.service");
let DashboardService = class DashboardService {
    clickhouse;
    constructor(clickhouse) {
        this.clickhouse = clickhouse;
    }
    async summary(companyId) { const rows = await this.clickhouse.query(`SELECT sum(revenue) revenue, sum(active_projects) active_projects, sum(employees) employees FROM mv_dashboard_daily WHERE ({companyId:Nullable(String)} IS NULL OR company_id = {companyId:Nullable(String)})`, { companyId: companyId ?? null }); return rows[0] ?? { revenue: '0', active_projects: '0', employees: '0' }; }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clickhouse_service_1.ClickHouseService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map