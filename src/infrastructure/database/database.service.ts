import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, RowDataPacket, createPool } from 'mysql2/promise';

export type PrimeDatabase = 'prime' | 'auto';
type SqlValue = string | number | boolean | Date | null;

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pools: Record<PrimeDatabase, Pool>;

  constructor(config: ConfigService) {
    this.pools = {
      prime: this.createPool(config, 'DB_'),
      auto: this.createPool(config, 'DB_AUTO_'),
    };
  }

  async query<T extends RowDataPacket = RowDataPacket>(
    database: PrimeDatabase,
    sql: string,
    values: SqlValue[] = [],
  ): Promise<T[]> {
    const [rows] = await this.pools[database].execute<T[]>(sql, values);
    return rows;
  }

  async ping(): Promise<{ prime: boolean; auto: boolean }> {
    const status = await Promise.allSettled([
      this.query('prime', 'SELECT 1 AS connected'),
      this.query('auto', 'SELECT 1 AS connected'),
    ]);
    return { prime: status[0].status === 'fulfilled', auto: status[1].status === 'fulfilled' };
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all(Object.values(this.pools).map((pool) => pool.end()));
  }

  private createPool(config: ConfigService, prefix: 'DB_' | 'DB_AUTO_'): Pool {
    // Prime historically used one connection in local environments.  Keeping the
    // fallback here lets the migrated API use that same .env while deployments
    // can still configure a separate AUTO database explicitly.
    const fallbackPrefix = prefix === 'DB_AUTO_' ? 'DB_' : prefix;
    const value = (key: string) =>
      config.get<string>(`${prefix}${key}`) ?? config.getOrThrow<string>(`${fallbackPrefix}${key}`);

    return createPool({
      host: value('HOST'),
      port: Number(
        config.get<string>(`${prefix}PORT`) ??
          config.get<string>(`${fallbackPrefix}PORT`) ??
          3306,
      ),
      user: value('USERNAME'),
      password: value('PASSWORD'),
      database: value('DATABASE'),
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
      timezone: 'Z',
    });
  }
}
