import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('nmonplan')
export class Nmonplan {
  @PrimaryColumn()
  plant: string;

  @PrimaryColumn()
  thn: number;

  @PrimaryColumn()
  bln: number;

  @Column({ type: 'decimal', precision: 18, scale: 4, nullable: true })
  sales_plan: number;

  @Column({ type: 'decimal', precision: 18, scale: 4, nullable: true })
  sales_act: number;

  @Column({ type: 'decimal', precision: 18, scale: 4, nullable: true })
  revenue_act: number;
}