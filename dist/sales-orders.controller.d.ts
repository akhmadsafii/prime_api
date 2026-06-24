import { SalesOrdersService } from './sales-orders.service';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';
import { UpdateSalesOrderDto } from './dto/update-sales-order.dto';
export declare class SalesOrdersController {
    private readonly salesOrdersService;
    constructor(salesOrdersService: SalesOrdersService);
    create(createSalesOrderDto: CreateSalesOrderDto): Promise<SalesOrder>;
    findAll(page: number, limit: number, search: string): Promise<{
        data: CreateSalesOrderDto[];
        total: number;
    }>;
    findOne(id: number): Promise<SalesOrder>;
    update(id: number, updateSalesOrderDto: UpdateSalesOrderDto): Promise<SalesOrder>;
    remove(id: number): Promise<void>;
}
