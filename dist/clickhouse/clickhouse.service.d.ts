export declare class ClickHouseService {
    readonly client: import("@clickhouse/client").ClickHouseClient;
    query<T>(query: string, query_params?: Record<string, unknown>): Promise<T[]>;
}
