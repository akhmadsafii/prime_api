import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SalesOrder } from './sales-order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('sales_order_details')
export class SalesOrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SalesOrder, (order) => order.details, { onDelete: 'CASCADE' })
  salesOrder: SalesOrder;

  @ManyToOne(() => Product, { eager: true }) // Eager load product info
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerUnit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}