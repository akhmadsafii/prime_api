import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
@ApiTags('dashboard') @Controller('dashboard')
export class DashboardController { constructor(private readonly dashboard: DashboardService) {} @Get('summary') summary(@Query('companyId') companyId?: string) { return this.dashboard.summary(companyId); } }
