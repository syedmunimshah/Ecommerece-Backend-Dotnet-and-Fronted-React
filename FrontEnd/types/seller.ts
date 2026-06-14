export const SellerStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
} as const;

export type SellerStatusValue =
  (typeof SellerStatus)[keyof typeof SellerStatus];

export interface SellerProfileDto {
  Id: number;
  UserId: number;
  StoreName: string;
  StoreDescription: string | null;
  StoreAddress: string | null;
  PhoneNumber: string | null;
  CreatedBy: number | null;
  Status: SellerStatusValue;
  IsActive: boolean;
  CreatedDate: string | null;
  ApprovedBy: number | null;
  ApprovedAt: string | null;
  UserName: string;
  RoleName: string;
  StatusName: string;
}

export interface CreateSellerProfileDto {
  StoreName: string;
  StoreDescription?: string | null;
  StoreAddress?: string | null;
  PhoneNumber?: string | null;
}
