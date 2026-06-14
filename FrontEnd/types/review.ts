export interface ReviewDto {
  Id: number;
  ProductId: number;
  UserId: number;
  Rating: number;
  Comment: string;
  CreatedDate: string;
}

export interface CreateReviewDto {
  ProductId: number;
  Rating: number;
  Comment?: string | null;
}
