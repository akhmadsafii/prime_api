import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RowDataPacket } from 'mysql2/promise';
export type PrimeDatabase = 'prime' | 'auto';
export declare class DatabaseService implements OnModuleDestroy {
    private readonly pools;
    constructor(config: ConfigService);
    query<T extends RowDataPacket = RowDataPacket>(database: PrimeDatabase, sql: string, values?: any[]): Promise<T[]>;
    ping(): Promise<{
        prime: boolean;
        auto: boolean;
    }>;
    onModuleDestroy(): Promise<void>;
    private createPool;
}
