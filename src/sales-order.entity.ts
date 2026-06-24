import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { SalesOrderDetail } from './sales-order-detail.entity';

export type SalesOrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

@Entity('sales_orders')
export class SalesOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderNumber: string;

  @Column()
  customerName: string;

  @Column({ type: 'timestamptz' })
  orderDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: SalesOrderStatus;

  @OneToMany(() => SalesOrderDetail, (detail) => detail.salesOrder, { cascade: true })
  details: SalesOrderDetail[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}