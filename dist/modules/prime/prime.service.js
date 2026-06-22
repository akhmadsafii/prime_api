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
exports.PrimeService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
let PrimeService = class PrimeService {
    database;
    constructor(database) {
        this.database = database;
    }
    health() {
        return this.database.ping();
    }
    async panelSales(inputDate, inputPlant) {
        const selectedDate = inputDate ? new Date(`${inputDate}T00:00:00`) : new Date();
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const plant = inputPlant || '1201';
        const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
        const monthEnd = new Date(year, month, 0).toISOString().slice(0, 10);
        const trailingYearStart = new Date(year - 1, month - 1, 1).toISOString().slice(0, 10);
        const date = inputDate || new Date().toISOString().slice(0, 10);
        const [plan] = await this.database.query('auto', `
      SELECT sales_plan, sales_act, revenue_plan, revenue_act
      FROM nmonplan WHERE plant = ? AND thn = ? AND bln = ? LIMIT 1`, [plant, year, month]);
        const [workday] = await this.database.query('auto', `
      SELECT HK_KE, JHK FROM parhk
      WHERE plant = ? AND ishk = 1 AND actual_date = ?
      ORDER BY actual_date DESC LIMIT 1`, [plant, date]);
        const number = (value) => Number(value ?? 0);
        const round = (value, precision = 2) => Number(value.toFixed(precision));
        const safeDiv = (a, b) => (b ? a / b : 0);
        const salesPlan = number(plan?.sales_plan);
        const salesActual = number(plan?.sales_act);
        const revenuePlan = number(plan?.revenue_plan);
        const revenueActual = number(plan?.revenue_act);
        const workdayActual = number(workday?.HK_KE);
        const workdayTotal = number(workday?.JHK);
        const [products, priceTrend, regions, productionVsSales, orders] = await Promise.all([
            this.database.query('auto', `
        SELECT d.id_jenis AS id, d.jenis_produk AS label, SUM(b.m3) AS value
        FROM fgpbt01a a
        INNER JOIN fgpbt01b b ON a.no_lpb = b.no_lpb
        INNER JOIN item01a c ON b.id_produk = c.id_item
        INNER JOIN mstm01 d ON d.id_jenis = c.id_jenis
        WHERE a.status = 2 AND a.isaktif = 1 AND a.plant = ? AND a.tgl_pb BETWEEN ? AND ?
        GROUP BY d.id_jenis, d.jenis_produk ORDER BY d.id_jenis`, [plant, monthStart, monthEnd]),
            this.database.query('auto', `
        SELECT thn AS label, AVG(revenue_plan / NULLIF(sales_plan, 0)) AS plan,
          AVG(revenue_act / NULLIF(sales_act, 0)) AS actual
        FROM nmonplan WHERE plant = ? AND deleted_at IS NULL AND thn BETWEEN ? AND ?
        GROUP BY thn ORDER BY thn`, [plant, year - 5, year]),
            this.database.query('auto', `
        SELECT a.keterangan AS label, SUM(b.m3) AS value
        FROM fgpbt01a a
        INNER JOIN fgpbt01b b ON a.no_lpb = b.no_lpb
        WHERE a.status = 2 AND a.isaktif = 1 AND a.plant = ? AND a.tgl_pb BETWEEN ? AND ?
          AND a.keterangan IN ('Export', 'Lokal')
        GROUP BY a.keterangan`, [plant, monthStart, monthEnd]),
            this.database.query('auto', `
        SELECT DATE_FORMAT(a.tgl_pb, '%Y-%m') AS month,
          SUM(IF(a.status = 1, b.m3, 0)) AS production,
          SUM(IF(a.status = 2, b.m3, 0)) AS sales
        FROM fgpbt01a a
        INNER JOIN fgpbt01b b ON a.no_lpb = b.no_lpb
        WHERE a.isaktif = 1 AND a.plant = ? AND a.tgl_pb BETWEEN ? AND ?
        GROUP BY DATE_FORMAT(a.tgl_pb, '%Y-%m') ORDER BY month`, [plant, trailingYearStart, monthEnd]),
            this.database.query('auto', `
        SELECT DATE_FORMAT(a.req_date_h, '%Y-%m') AS month, ROUND(SUM(b.zzbase)) AS value
        FROM nsapsoh a INNER JOIN nsapsod1 b ON a.vbeln = b.vbeln
        WHERE a.deleted_at IS NULL AND a.plant = ? AND a.req_date_h BETWEEN ? AND ?
        GROUP BY DATE_FORMAT(a.req_date_h, '%Y-%m') ORDER BY month`, [plant, trailingYearStart, monthEnd]),
        ]);
        return {
            success: true,
            message: 'Sales dashboard summary',
            data: {
                summary: {
                    period: { month, year, start_date: monthStart, end_date: monthEnd, plant },
                    sales_performance: {
                        actual_sales_qty: round(salesActual), annual_sales_target: round(salesPlan),
                        achievement_percentage: round(safeDiv(salesActual, salesPlan) * 100),
                        status: salesActual >= salesPlan ? 'target_achieved' : 'below_target',
                    },
                    pricing_performance: {
                        actual_selling_price: round(safeDiv(revenueActual, salesActual)),
                        annual_asp_target: round(safeDiv(revenuePlan, salesPlan)),
                        achievement_percentage: round(safeDiv(safeDiv(revenueActual, salesActual), safeDiv(revenuePlan, salesPlan)) * 100),
                        variance: round(safeDiv(revenueActual, salesActual) - safeDiv(revenuePlan, salesPlan)),
                    },
                    additional_metrics: {
                        total_order_quantity: round(safeDiv(salesPlan, workdayTotal) * workdayActual),
                        average_order_value: round(safeDiv(safeDiv(salesPlan, workdayTotal) * workdayActual, salesPlan)),
                        total_orders: round(salesPlan),
                    },
                },
                charts: {
                    sales_product: { categories: products.map((row) => row.id), actual: products.map((row) => round(number(row.value), 0)), plan: products.map(() => 0), unit: 'M3' },
                    sales_order_monthly: { categories: orders.map((row) => row.month), sales_order: orders.map((row) => round(number(row.value), 0)), outstanding: orders.map(() => 0) },
                    region_sales: { categories: regions.map((row) => row.label), data: regions.map((row) => round(number(row.value), 0)), unit: 'M3' },
                    prod_vs_sales: { categories: productionVsSales.map((row) => row.month), production: productionVsSales.map((row) => round(number(row.production), 0)), sales: productionVsSales.map((row) => round(number(row.sales), 0)) },
                    avg_price_trend: { categories: priceTrend.map((row) => row.label), plan: priceTrend.map((row) => round(number(row.plan))), price: priceTrend.map((row) => round(number(row.actual))), unit: '$/m²' },
                },
            },
        };
    }
    async panelProduction(inputDate, inputPlant) {
        const selected = inputDate ? new Date(`${inputDate}T00:00:00`) : new Date();
        const year = selected.getFullYear();
        const month = selected.getMonth() + 1;
        const plant = inputPlant || '1201';
        const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
        const monthEnd = new Date(year, month, 0).toISOString().slice(0, 10);
        const yearStart = `${year}-01-01`;
        const n = (v) => Number(v ?? 0);
        const r = (v) => Math.round(v);
        const [planRows, actualRows, productRows, inventoryRows, stockRows, trendRows, recoveryRows] = await Promise.all([
            this.database.query('auto', `SELECT c.det_cat2 label,SUM(a.vol) value FROM plan01a a INNER JOIN plan01b b ON a.id_plan=b.id_plan INNER JOIN plan01 c ON c.id_cat=b.ket INNER JOIN syplant d ON d.old_plant=a.lks WHERE a.tahun=? AND a.bulan=? AND d.plant=? AND b.ket LIKE 'fg%' GROUP BY c.det_cat2`, [year, month, plant]),
            this.database.query('auto', `SELECT SUM(b.m3) value FROM fgpbt01a a INNER JOIN fgpbt01b b ON a.no_lpb=b.no_lpb WHERE a.status=2 AND a.isaktif=1 AND a.plant=? AND a.tgl_pb BETWEEN ? AND ?`, [plant, monthStart, monthEnd]),
            this.database.query('auto', `SELECT d.det_cat2 label,SUM(b.m3) actual FROM fgpbt01a a INNER JOIN fgpbt01b b ON a.no_lpb=b.no_lpb INNER JOIN item01a c ON b.id_produk=c.id_item INNER JOIN plan01 d ON d.id_cat=c.other_ref6 WHERE a.status=2 AND a.isaktif=1 AND a.plant=? AND a.tgl_pb BETWEEN ? AND ? GROUP BY d.det_cat2 ORDER BY d.det_cat2`, [plant, monthStart, monthEnd]),
            this.database.query('auto', `SELECT SUM(IF(a.tgl_pb BETWEEN ? AND ?,b.m3,0)) mtd,SUM(b.m3) ytd FROM fgpbt01a a INNER JOIN fgpbt01b b ON a.no_lpb=b.no_lpb WHERE a.status=2 AND a.isaktif=1 AND a.plant=? AND a.tgl_pb BETWEEN ? AND ?`, [monthStart, monthEnd, plant, yearStart, monthEnd]),
            this.database.query('auto', `SELECT DATE_FORMAT(CONCAT(thn,'-',bln,'-01'),'%Y-%m') label,SUM(act) value FROM nmonpland1 WHERE plant=? AND DATE_FORMAT(CONCAT(thn,'-',bln,'-01'),'%Y-%m') BETWEEN ? AND ? AND deleted_at IS NULL GROUP BY label ORDER BY label`, [plant, yearStart.slice(0, 7), monthEnd.slice(0, 7)]),
            this.database.query('auto', `SELECT DATE_FORMAT(CONCAT(thn,'-',bln,'-01'),'%Y-%m') label,SUM(sales_plan) plan,SUM(sales_act) actual FROM nmonplan WHERE plant=? AND DATE_FORMAT(CONCAT(thn,'-',bln,'-01'),'%Y-%m') BETWEEN ? AND ? AND deleted_at IS NULL GROUP BY label ORDER BY label`, [plant, yearStart.slice(0, 7), monthEnd.slice(0, 7)]),
            this.database.query('auto', `SELECT DATE_FORMAT(tgl_posting,'%Y-%m') label,SUM(m3) value FROM prov01 WHERE isaktif=1 AND inout='in' AND id_station='glu' AND plant=? AND trs_type='prod' AND tgl_posting BETWEEN ? AND ? GROUP BY label ORDER BY label`, [plant, yearStart, monthEnd]),
        ]);
        const planned = planRows.reduce((sum, row) => sum + n(row.value), 0);
        const actual = n(actualRows[0]?.value);
        const planByProduct = Object.fromEntries(planRows.map(row => [row.label, r(n(row.value))]));
        const trendByMonth = Object.fromEntries(trendRows.map(row => [row.label, n(row.actual)]));
        return { success: true, message: 'Production data retrieved successfully', data: {
                outputProduction: { actual: r(actual), plan: r(planned), percentage: r(planned ? actual / planned * 100 : 0), unit: 'm3' },
                outputProductionChart: { categories: productRows.map(x => x.label), actual: productRows.map(x => r(n(x.actual))), plan: productRows.map(x => planByProduct[x.label] || 0) },
                cumulativeInventory: { cumulative: 0, mtd: r(n(inventoryRows[0]?.mtd)), ytd: r(n(inventoryRows[0]?.ytd)), unit: 'm3' },
                stockTrend: { categories: stockRows.map(x => x.label), data: stockRows.map(x => r(n(x.value))) },
                productionTrend: { categories: trendRows.map(x => x.label), actual: trendRows.map(x => r(n(x.actual))), plan: trendRows.map(x => r(n(x.plan))) },
                recoveryFactor: { categories: recoveryRows.map(x => x.label), plan: 0, actual: recoveryRows.map(x => Number((n(x.value) / (trendByMonth[x.label] || 1) * 100).toFixed(2))) },
                filters: { periods: [['today', 'Today'], ['week', 'This Week'], ['month', 'This Month'], ['quarter', 'This Quarter'], ['year', 'This Year']].map(([value, label]) => ({ value, label })) }
            } };
    }
};
exports.PrimeService = PrimeService;
exports.PrimeService = PrimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], PrimeService);
//# sourceMappingURL=prime.service.js.map