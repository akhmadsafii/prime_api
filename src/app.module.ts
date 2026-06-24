import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'node:path';
import { validateEnvironment } from './config/env.validation';
import { ClickHouseModule } from './infrastructure/clickhouse/clickhouse.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PrimeModule } from './modules/prime/prime.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Local development reuses Prime's existing database configuration.
      // Docker injects the same values via compose env_file.
      envFilePath: [
        '.env',
        join(process.cwd(), '../../../prime/prime_api/.env'),
        join(process.cwd(), '../../prime/prime_api/.env'),
        join(process.cwd(), '../prime/prime_api/.env'),
      ],
      validate: validateEnvironment,
    }),
    LoggerModule.forRoot({
      pinoHttp: { transport: { target: "pino-pretty" } },
    }),
    ClickHouseModule,
    DashboardModule,
    DatabaseModule,
    AuthModule,
    PrimeModule,
  ],
})
export class AppModule {}
