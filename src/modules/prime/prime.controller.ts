import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrimeService } from './prime.service';
import { PrimeSalesService } from './sales/prime-sales.service';

@ApiTags('prime')
@Controller('prime')
export class PrimeController {
  constructor(
    private readonly prime: PrimeService,
    private readonly sales: PrimeSalesService,
  ) {}

  @Get('health')
  health() {
    return this.prime.health();
  }

  /** Direct NestJS replacement for Prime's panel/sales/summary/stats endpoint. */
  @Get('panel/sales/summary/stats')
  panelSales(@Query('tgl') date?: string, @Query('plant') plant?: string) {
    if (date && Number.isNaN(Date.parse(date))) {
      throw new BadRequestException('tgl must be a valid date');
    }
    return this.sales.getSummary(date, plant);
  }

  @Get('panel/production/get_data')
  panelProduction(@Query('tgl') date?: string, @Query('plant') plant?: string) {
    if (date && Number.isNaN(Date.parse(date))) throw new BadRequestException('tgl must be a valid date');
    return this.prime.panelProduction(date, plant);
  }
}
