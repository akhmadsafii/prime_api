import { ClickHouseService } from '../../infrastructure/clickhouse/clickhouse.service';
export declare class DashboardService {
    private readonly clickhouse;
    constructor(clickhouse: ClickHouseService);
    summary(companyId?: string): Promise<{
        revenue: string;
        active_projects: string;
        employees: string;
    }>;
}
