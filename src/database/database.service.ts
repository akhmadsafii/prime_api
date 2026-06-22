import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, RowDataPacket, createPool } from 'mysql2/promise';

export type PrimeDatabase = 'prime' | 'auto';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pools: Record<PrimeDatabase, Pool>;

  constructor(config: ConfigService) {
    this.pools = {
      prime: this.createPool(config, 'DB_'),
      auto: this.createPool(config, 'DB_AUTO_'),
    };
  }

  async query<T extends RowDataPacket = RowDataPacket>(database: PrimeDatabase, sql: string, values: any[] = []): Promise<T[]> {
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
    return createPool({
      host: config.getOrThrow<string>(`${prefix}HOST`),
      port: Number(config.get<string>(`${prefix}PORT`) ?? 3306),
      user: config.getOrThrow<string>(`${prefix}USERNAME`),
      password: config.getOrThrow<string>(`${prefix}PASSWORD`),
      database: config.getOrThrow<string>(`${prefix}DATABASE`),
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
      timezone: 'Z',
    });
  }
}
