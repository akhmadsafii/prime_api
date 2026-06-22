import { PrimeService } from './prime.service';
export declare class PrimeController {
    private readonly prime;
    constructor(prime: PrimeService);
    health(): Promise<{
        prime: boolean;
        auto: boolean;
    }>;
    panelSales(date?: string, plant?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            summary: {
                period: {
                    month: number;
                    year: number;
                    start_date: string;
                    end_date: string;
                    plant: string;
                };
                sales_performance: {
                    actual_sales_qty: number;
                    annual_sales_target: number;
                    achievement_percentage: number;
                    status: string;
                };
                pricing_performance: {
                    actual_selling_price: number;
                    annual_asp_target: number;
                    achievement_percentage: number;
                    variance: number;
                };
                additional_metrics: {
                    total_order_quantity: number;
                    average_order_value: number;
                    total_orders: number;
                };
            };
            charts: {
                sales_product: {
                    categories: any[];
                    actual: number[];
                    plan: number[];
                    unit: string;
                };
                sales_order_monthly: {
                    categories: any[];
                    sales_order: number[];
                    outstanding: number[];
                };
                region_sales: {
                    categories: any[];
                    data: number[];
                    unit: string;
                };
                prod_vs_sales: {
                    categories: any[];
                    production: number[];
                    sales: number[];
                };
                avg_price_trend: {
                    categories: any[];
                    plan: number[];
                    price: number[];
                    unit: string;
                };
            };
        };
    }>;
    panelProduction(date?: string, plant?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            outputProduction: {
                actual: number;
                plan: number;
                percentage: number;
                unit: string;
            };
            outputProductionChart: {
                categories: any[];
                actual: number[];
                plan: any[];
            };
            cumulativeInventory: {
                cumulative: number;
                mtd: number;
                ytd: number;
                unit: string;
            };
            stockTrend: {
                categories: any[];
                data: number[];
            };
            productionTrend: {
                categories: any[];
                actual: number[];
                plan: number[];
            };
            recoveryFactor: {
                categories: any[];
                plan: number;
                actual: number[];
            };
            filters: {
                periods: {
                    value: string;
                    label: string;
                }[];
            };
        };
    }>;
}
