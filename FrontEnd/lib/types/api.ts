export type UserRole = "Admin" | "User" | "Seller";

export interface PagedRequest {
  pageNumber?: number;
  pageSize?: number;
}

export interface PagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  data: T[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface TokenResponse {
  token: string;
  expiresIn: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface MessageResponse {
  message: string;
}

export interface ImageUploadResponse {
  url: string;
  fileName: string;
}

export interface ProductListParams extends PagedRequest {
  sellerId?: number;
  search?: string;
  categoryId?: number;
}

export interface UpdateOrderStatusDto {
  status: string;
}

export interface UserDto {
  id: number;
  fullName: string;
  email: string;
  roleId: number;
  roleName: UserRole;
  isActive: boolean;
  image: string | null;
  createdDate: string | null;
  updateDate: string | null;
}

export interface UpdateProfileDto {
  fullName: string;
  newPassword?: string;
}

export interface AdminUpdateUserDto {
  fullName: string;
  email: string;
  isActive: boolean;
  roleId: number;
}

export interface ProductDto {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  image: string | null;
  categoryId: number | null;
  categoryName: string | null;
  sellerName: string | null;
  sellerId: number;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  categoryId?: number;
}

export interface UpdateProductDto extends CreateProductDto {
  isActive?: boolean;
}

export interface CategoryDto {
  id: number;
  name: string;
  isActive: boolean;
}

export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface CartDto {
  id: number;
  userId: number;
  userName: string;
  items: CartItemDto[];
  totalAmount: number;
}

export interface AddCartItemDto {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  cartItemId: number;
  quantity: number;
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface ShippingAddressDto {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string | null;
  notes?: string | null;
}

export interface OrderDto {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdDate: string | null;
  items: OrderItemDto[];
  /** Null on orders placed before delivery addresses were collected. */
  shippingAddress: ShippingAddressDto | null;
}

export interface CreateOrderDto {
  shippingAddress: ShippingAddressDto;
}

export interface OrderTrackingDto {
  id: number;
  orderId: number;
  status: string;
  createdDate: string | null;
}

export interface CreatePaymentDto {
  orderId: number;
  // "COD" (cash on delivery) or "Card" (Stripe Checkout). The amount is never
  // sent by the client — the server always charges the order total.
  paymentMethod: string;
}

export interface PaymentDto {
  id: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: string;
  paidAt: string | null;
}

export interface PaymentResultDto {
  type: string; // "cod" | "stripe_checkout"
  payment?: PaymentDto | null;
  checkoutUrl?: string | null;
}

export interface CreateReviewDto {
  productId: number;
  rating: number;
  comment?: string;
}

export interface ReviewDto {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  productName: string;
  rating: number;
  comment: string;
  createdDate: string;
}

export interface CreateSellerProfileDto {
  storeName: string;
  storeDescription?: string;
  storeAddress?: string;
  phoneNumber?: string;
}

export interface SellerProfileDto {
  id: number;
  userId: number;
  storeName: string;
  storeDescription: string | null;
  storeAddress: string | null;
  phoneNumber: string | null;
  status: number;
  statusName: string;
  isActive: boolean;
  userName: string;
  roleName: string;
  createdDate: string | null;
  approvedBy: number | null;
  approvedAt: string | null;
}

export interface RoleDto {
  id: number;
  name: string;
  isActive: boolean;
}

export interface CreateRoleDto {
  name: string;
}

export interface UpdateRoleDto {
  name: string;
  isActive: boolean;
}

export interface ChatMessageDto {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequestDto {
  message: string;
  history: ChatMessageDto[];
}

export interface ChatToolCallDto {
  name: string;
  input: string;
}

export interface ChatResponseDto {
  reply: string;
  toolCalls: ChatToolCallDto[];
}
