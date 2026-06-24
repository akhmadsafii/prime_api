import { SalesOrderDetail } from './sales-order-detail.entity';
export type SalesOrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
export declare class SalesOrder {
    id: number;
    orderNumber: string;
    customerName: string;
    orderDate: Date;
    totalAmount: number;
    status: SalesOrderStatus;
    details: SalesOrderDetail[];
    createdAt: Date;
    updatedAt: Date;
}
