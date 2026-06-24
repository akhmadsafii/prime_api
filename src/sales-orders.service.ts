import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DataSource } from 'typeorm';
import { SalesOrder } from './entities/sales-order.entity';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';
import { UpdateSalesOrderDto } from './dto/update-sales-order.dto';
import { Product } from '../products/entities/product.entity';
import { SalesOrderDetail } from './entities/sales-order-detail.entity';

@Injectable()
export class SalesOrdersService {
  constructor(
    @InjectRepository(SalesOrder)
    private soRepository: Repository<SalesOrder>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource, // Inject DataSource for transactions
  ) {}

  async create(dto: CreateSalesOrderDto): Promise<SalesOrder> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const order = new SalesOrder();
      order.customerName = dto.customerName;
      order.orderDate = new Date(dto.orderDate);
      order.orderNumber = `SO-${Date.now()}`; // Simple order number generation
      order.details = [];

      let totalAmount = 0;

      for (const itemDto of dto.items) {
        const product = await transactionalEntityManager.findOneBy(Product, { id: itemDto.productId });
        if (!product) {
          throw new NotFoundException(`Product with ID ${itemDto.productId} not found.`);
        }
        const detail = new SalesOrderDetail();
        detail.product = product;
        detail.quantity = itemDto.quantity;
        detail.pricePerUnit = product.price;
        detail.subtotal = itemDto.quantity * product.price;
        order.details.push(detail);
        totalAmount += detail.subtotal;
      }

      order.totalAmount = totalAmount;
      return transactionalEntityManager.save(order);
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    search = '',
  ): Promise<{ data: SalesOrder[]; total: number }> {
    const [data, total] = await this.soRepository.findAndCount({
      where: search
        ? [{ orderNumber: ILike(`%${search}%`) }, { customerName: ILike(`%${search}%`) }]
        : {},
      relations: { details: true }, // Load details relation
      order: { orderDate: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findOne(id: number): Promise<SalesOrder> {
    const order = await this.soRepository.findOne({
      where: { id },
      relations: { details: { product: true } }, // Deeply load product within details
    });
    if (!order) {
      throw new NotFoundException(`Sales Order with ID "${id}" not found`);
    }
    return order;
  }

  async update(id: number, dto: UpdateSalesOrderDto): Promise<SalesOrder> {
    // Note: Updating line items would require a more complex logic
    // For now, we only update the status.
    const order = await this.soRepository.preload({
      id: id,
      status: dto.status,
    });
    if (!order) {
      throw new NotFoundException(`Sales Order with ID "${id}" not found`);
    }
    return this.soRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const result = await this.soRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Sales Order with ID "${id}" not found`);
    }
  }
}