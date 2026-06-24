import { Injectable } from '@nestjs/common';
import { createClient } from '@clickhouse/client';

@Injectable()
export class ClickHouseService {
  readonly client = createClient({
    url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
    database: process.env.CLICKHOUSE_DATABASE ?? 'dashboard',
  });

  async query<T>(
    query: string,
    queryParams: Record<string, unknown> = {},
  ): Promise<T[]> {
    const result = await this.client.query({
      query,
      query_params: queryParams,
      format: 'JSONEachRow',
    });

    return result.json<T>();
  }
}
