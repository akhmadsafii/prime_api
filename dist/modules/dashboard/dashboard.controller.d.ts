import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboard;
    constructor(dashboard: DashboardService);
    summary(companyId?: string): Promise<{
        revenue: string;
        active_projects: string;
        employees: string;
    }>;
}
