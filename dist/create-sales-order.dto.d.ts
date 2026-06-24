declare class OrderItemDto {
    productId: number;
    quantity: number;
}
export declare class CreateSalesOrderDto {
    customerName: string;
    orderDate: string;
    items: OrderItemDto[];
}
export {};
