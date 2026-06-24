import { CreateSalesOrderDto } from './create-sales-order.dto';
import { SalesOrderStatus } from '../entities/sales-order.entity';
declare const UpdateSalesOrderDto_base: import("@nestjs/common").Type<Partial<CreateSalesOrderDto>>;
export declare class UpdateSalesOrderDto extends UpdateSalesOrderDto_base {
    status?: SalesOrderStatus;
}
export {};
