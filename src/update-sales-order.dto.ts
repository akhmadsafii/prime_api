import { PartialType } from '@nestjs/swagger';
import { CreateSalesOrderDto } from './create-sales-order.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { SalesOrderStatus } from '../entities/sales-order.entity';

export class UpdateSalesOrderDto extends PartialType(CreateSalesOrderDto) {
  @IsEnum(['pending', 'processing', 'shipped', 'completed', 'cancelled'])
  @IsOptional()
  status?: SalesOrderStatus;
}