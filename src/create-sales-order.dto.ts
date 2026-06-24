import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDateString, IsNumber, Min, IsArray, ValidateNested, IsInt } from 'class-validator';

class OrderItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateSalesOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsDateString()
  orderDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}