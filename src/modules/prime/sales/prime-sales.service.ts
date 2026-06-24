import { Injectable } from '@nestjs/common';
import { PrimeService } from '../prime.service';

/**
 * Entry point for the Prime sales dashboard.
 *
 * Keeping this provider in a dedicated feature folder makes the sales API easy
 * to find while preserving the existing response and route contract.
 */
@Injectable()
export class PrimeSalesService {
  constructor(private readonly prime: PrimeService) {}

  getSummary(date?: string, plant?: string) {
    return this.prime.panelSales(date, plant);
  }
}
