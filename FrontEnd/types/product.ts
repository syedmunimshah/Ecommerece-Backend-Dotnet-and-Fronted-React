export interface ProductDto {
  Id: number;
  Name: string;
  Description: string | null;
  Price: number;
  Stock: number;
  IsActive: boolean;
  Image: string | null;
  CategoryId: number | null;
  CategoryName: string | null;
  SellerName: string | null;
  SellerId: number;
}

export interface CreateProductDto {
  Name: string;
  Description?: string | null;
  Price: number;
  Stock: number;
  Image?: string | null;
  CategoryId?: number | null;
}

export interface UpdateProductDto extends CreateProductDto {
  IsActive?: boolean;
}
