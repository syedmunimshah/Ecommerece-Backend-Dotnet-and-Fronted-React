export interface OrderItemDto {
  ProductId: number;
  ProductName: string;
  Quantity: number;
  Price: number;
}

export interface OrderDto {
  Id: number;
  UserId: number;
  TotalAmount: number;
  Status: string;
  CreatedDate: string | null;
  Items: OrderItemDto[];
}

export interface OrderTrackingDto {
  Id: number;
  OrderId: number;
  Status: string;
  CreatedDate: string | null;
  CreatedBy: number | null;
  UpdateDate: string | null;
  UpdateBy: number | null;
}
