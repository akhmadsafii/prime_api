import { SalesOrder } from './sales-order.entity';
import { Product } from '../../products/entities/product.entity';
export declare class SalesOrderDetail {
    id: number;
    salesOrder: SalesOrder;
    product: Product;
    quantity: number;
    pricePerUnit: number;
    subtotal: number;
}
