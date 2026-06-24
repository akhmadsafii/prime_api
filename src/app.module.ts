import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'node:path';
import { ClickHouseModule } from './clickhouse/clickhouse.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DatabaseModule } from './database/database.module';
import { PrimeModule } from './modules/prime/prime.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Local development reuses Prime's existing database configuration.
      // Docker injects the same values via compose env_file.
      envFilePath: ['.env', join(process.cwd(), '../../../prime/prime_api/.env'), join(process.cwd(), '../../prime/prime_api/.env'), join(process.cwd(), '../prime/prime_api/.env')],
    }),
    LoggerModule.forRoot({ pinoHttp: { transport: { target: 'pino-pretty' } } }),
    ClickHouseModule,
    DashboardModule,
    DatabaseModule,
    AuthModule,
    PrimeModule,
  ],
})
export class AppModule {}
