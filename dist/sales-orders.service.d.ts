import { Repository, DataSource } from 'typeorm';
import { SalesOrder } from './entities/sales-order.entity';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';
import { UpdateSalesOrderDto } from './dto/update-sales-order.dto';
import { Product } from '../products/entities/product.entity';
export declare class SalesOrdersService {
    private soRepository;
    private productRepository;
    private dataSource;
    constructor(soRepository: Repository<SalesOrder>, productRepository: Repository<Product>, dataSource: DataSource);
    create(dto: CreateSalesOrderDto): Promise<SalesOrder>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: SalesOrder[];
        total: number;
    }>;
    findOne(id: number): Promise<SalesOrder>;
    update(id: number, dto: UpdateSalesOrderDto): Promise<SalesOrder>;
    remove(id: number): Promise<void>;
}
