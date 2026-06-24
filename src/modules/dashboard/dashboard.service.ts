import { Injectable } from '@nestjs/common';
import { ClickHouseService } from '../../infrastructure/clickhouse/clickhouse.service';
@Injectable()
export class DashboardService { constructor(private readonly clickhouse: ClickHouseService) {} async summary(companyId?: string) { const rows = await this.clickhouse.query<{ revenue: string; active_projects: string; employees: string }>(`SELECT sum(revenue) revenue, sum(active_projects) active_projects, sum(employees) employees FROM mv_dashboard_daily WHERE ({companyId:Nullable(String)} IS NULL OR company_id = {companyId:Nullable(String)})`, { companyId: companyId ?? null }); return rows[0] ?? { revenue: '0', active_projects: '0', employees: '0' }; } }
