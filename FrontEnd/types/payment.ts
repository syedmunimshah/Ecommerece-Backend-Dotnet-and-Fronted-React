export interface CreatePaymentDto {
  OrderId: number;
  Amount: number;
  PaymentMethod: string;
}

export interface PaymentDto {
  Id: number;
  OrderId: number;
  Amount: number;
  PaymentMethod: string;
  TransactionId?: string | null;
  Status: string;
  PaidAt?: string | null;
  CreatedDate?: string | null;
}
