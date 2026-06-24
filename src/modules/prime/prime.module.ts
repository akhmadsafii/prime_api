import { Module } from '@nestjs/common';
import { PrimeController } from './prime.controller';
import { PrimeService } from './prime.service';
import { PrimeSalesService } from './sales/prime-sales.service';

@Module({
  controllers: [PrimeController],
  providers: [PrimeService, PrimeSalesService],
})
export class PrimeModule {}
