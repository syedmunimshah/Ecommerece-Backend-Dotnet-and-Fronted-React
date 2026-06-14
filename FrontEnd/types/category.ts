export interface CategoryDto {
  Id: number;
  Name: string;
  IsActive: boolean;
}

export interface CreateCategoryDto {
  Name: string;
}

export interface UpdateCategoryDto extends CreateCategoryDto {
  IsActive?: boolean;
}
