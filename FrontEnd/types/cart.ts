export interface CartItemDto {
  Id: number;
  ProductId: number;
  ProductName: string;
  Quantity: number;
  Price: number;
}

export interface CartDto {
  Id: number;
  UserId: number;
  UserName: string;
  Items: CartItemDto[];
  TotalAmount: number;
}

export interface AddCartItemDto {
  ProductId: number;
  Quantity: number;
}

export interface UpdateCartItemDto {
  CartItemId: number;
  Quantity: number;
}
