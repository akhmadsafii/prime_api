import { Injectable } from '@nestjs/common';
import { createClient } from '@clickhouse/client';
@Injectable()
export class ClickHouseService {
  readonly client = createClient({ url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123', database: process.env.CLICKHOUSE_DATABASE ?? 'dashboard' });
  async query<T>(query: string, query_params: Record<string, unknown> = {}): Promise<T[]> { return (await this.client.query({ query, query_params, format: 'JSONEachRow' })).json<T>(); }
}
