import { baseApi } from "./baseApi";
import type { RootState } from "@/lib/store/store";
import { postFileUpload } from "@/lib/utils/uploadFetch";
import type {
  LoginDto,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  MessageResponse,
  ImageUploadResponse,
  ProductListParams,
  RegisterDto,
  UserDto,
  UpdateProfileDto,
  PagedResponse,
  ProductDto,
  CreateProductDto,
  UpdateProductDto,
  CategoryDto,
  CartDto,
  AddCartItemDto,
  UpdateCartItemDto,
  OrderDto,
  OrderTrackingDto,
  CreatePaymentDto,
  PaymentDto,
  PaymentResultDto,
  ReviewDto,
  CreateReviewDto,
  CreateSellerProfileDto,
  SellerProfileDto,
  AdminUpdateUserDto,
  RoleDto,
  CreateRoleDto,
  UpdateRoleDto,
  PagedRequest,
  ChatRequestDto,
  ChatResponseDto,
} from "@/lib/types/api";
import { unwrapPagedData } from "@/lib/utils/paged";
import { normalizeUserDto } from "@/lib/utils/user";

export const api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Auth ───
    login: builder.mutation<LoginResponse, LoginDto>({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<UserDto, RegisterDto>({
      query: (body) => ({
        url: "/api/auth/register",
        method: "POST",
        body: new URLSearchParams({
          FullName: body.fullName,
          Email: body.email,
          Password: body.password,
        }).toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }),
    }),
    forgotPassword: builder.mutation<MessageResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    // ─── User ───
    getProfile: builder.query<UserDto, void>({
      query: () => "/api/user/profile",
      transformResponse: (response: unknown) => normalizeUserDto(response),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<UserDto, UpdateProfileDto>({
      query: (body) => ({
        url: "/api/user/update-profile",
        method: "PUT",
        body,
      }),
      transformResponse: (response: unknown) => normalizeUserDto(response),
      invalidatesTags: ["User"],
    }),
    uploadProfileImage: builder.mutation<UserDto, File>({
      async queryFn(file, { getState }) {
        const token = (getState() as RootState).auth.token;
        return postFileUpload(
          "/api/upload/profile-image",
          file,
          token,
          normalizeUserDto,
        );
      },
      invalidatesTags: ["User"],
    }),

    // ─── Products ───
    getProducts: builder.query<PagedResponse<ProductDto>, ProductListParams | void>({
      query: (params) => ({
        url: "/api/product/getall",
        params: {
          PageNumber: params?.pageNumber ?? 1,
          PageSize: params?.pageSize ?? 12,
          ...(params?.sellerId ? { sellerId: params.sellerId } : {}),
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.categoryId ? { categoryId: params.categoryId } : {}),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProductById: builder.query<ProductDto, number>({
      query: (id) => `/api/product/getbyid/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Product", id }],
    }),
    uploadProductImage: builder.mutation<ImageUploadResponse, File>({
      async queryFn(file, { getState }) {
        const token = (getState() as RootState).auth.token;
        return postFileUpload(
          "/api/upload/product-image",
          file,
          token,
          (json) => json as ImageUploadResponse,
        );
      },
    }),
    createProduct: builder.mutation<ProductDto, CreateProductDto>({
      query: (body) => ({
        url: "/api/product/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation<ProductDto, { id: number; data: UpdateProductDto }>({
      query: ({ id, data }) => ({
        url: `/api/product/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/product/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // ─── Categories ───
    getCategories: builder.query<CategoryDto[], void>({
      query: () => ({
        url: "/api/categories/getall",
        params: { PageNumber: 1, PageSize: 100 },
      }),
      transformResponse: (response: unknown) => unwrapPagedData<CategoryDto>(response),
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query<CategoryDto, number>({
      query: (id) => `/api/categories/getbyid/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation<CategoryDto, { name: string }>({
      query: (body) => ({
        url: "/api/categories/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<CategoryDto, { id: number; name: string; isActive: boolean }>({
      query: ({ id, ...body }) => ({
        url: `/api/categories/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/categories/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    // ─── Cart ───
    getCart: builder.query<CartDto, void>({
      query: () => "/api/cart/get",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<CartDto, AddCartItemDto>({
      query: (body) => ({
        url: "/api/cart/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<CartDto, UpdateCartItemDto>({
      query: (body) => ({
        url: "/api/cart/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation<CartDto, number>({
      query: (cartItemId) => ({
        url: `/api/cart/remove/remove/${cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ─── Orders ───
    createOrder: builder.mutation<OrderDto, void>({
      query: () => ({
        url: "/api/orders/create",
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Order", "Cart"],
    }),
    getMyOrders: builder.query<PagedResponse<OrderDto>, PagedRequest | void>({
      query: (params) => ({
        url: "/api/orders/getmyorders",
        params: {
          PageNumber: params?.pageNumber ?? 1,
          PageSize: params?.pageSize ?? 10,
        },
      }),
      providesTags: ["Order"],
    }),
    getSellerOrders: builder.query<PagedResponse<OrderDto>, PagedRequest | void>({
      query: (params) => ({
        url: "/api/orders/getsellerorders/seller",
        params: {
          PageNumber: params?.pageNumber ?? 1,
          PageSize: params?.pageSize ?? 10,
        },
      }),
      providesTags: ["Order"],
    }),
    getAllOrders: builder.query<PagedResponse<OrderDto>, PagedRequest | void>({
      query: (params) => ({
        url: "/api/orders/getall",
        params: {
          PageNumber: params?.pageNumber ?? 1,
          PageSize: params?.pageSize ?? 10,
        },
      }),
      providesTags: ["Order"],
    }),
    getOrderById: builder.query<OrderDto, number>({
      query: (id) => `/api/orders/getbyid/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Order", id }],
    }),
    getOrderTracking: builder.query<OrderTrackingDto[], number>({
      query: (id) => `/api/orders/${id}/tracking`,
    }),
    updateOrderStatus: builder.mutation<OrderDto, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/api/orders/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Order", id }, "Order"],
    }),

    // ─── Payments ───
    createPayment: builder.mutation<PaymentResultDto, CreatePaymentDto>({
      query: (body) => ({
        url: "/api/payments",
        method: "POST",
        body,
      }),
    }),
    getPaymentByOrder: builder.query<PaymentDto, number>({
      query: (orderId) => `/api/payments/${orderId}`,
    }),
    confirmPayment: builder.query<PaymentDto, string>({
      query: (sessionId) => `/api/payments/confirm?sessionId=${encodeURIComponent(sessionId)}`,
    }),

    // ─── AI assistant ───
    // The assistant can add to the cart, so a reply invalidates the cart cache.
    sendChatMessage: builder.mutation<ChatResponseDto, ChatRequestDto>({
      query: (body) => ({
        url: "/api/chat/message",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ─── Reviews ───
    getProductReviews: builder.query<PagedResponse<ReviewDto>, { productId: number } & PagedRequest>({
      query: ({ productId, pageNumber = 1, pageSize = 10 }) => ({
        url: `/api/products/${productId}/reviews`,
        params: { PageNumber: pageNumber, PageSize: pageSize },
      }),
      providesTags: (_r, _e, { productId }) => [{ type: "Review", id: productId }],
    }),
    createReview: builder.mutation<ReviewDto, CreateReviewDto>({
      query: (body) => ({
        url: "/api/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { productId }) => [{ type: "Review", id: productId }],
    }),
    deleteReview: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),

    // ─── Seller Profiles ───
    createSellerProfile: builder.mutation<SellerProfileDto, CreateSellerProfileDto>({
      query: (body) => ({
        url: "/api/sellerprofiles/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Seller"],
    }),
    getAllSellerProfiles: builder.query<SellerProfileDto[], void>({
      query: () => ({
        url: "/api/sellerprofiles/getall",
        params: { PageNumber: 1, PageSize: 100 },
      }),
      transformResponse: (response: unknown) => unwrapPagedData<SellerProfileDto>(response),
      providesTags: ["Seller"],
    }),
    getPendingSellers: builder.query<SellerProfileDto[], void>({
      query: () => ({
        url: "/api/sellerprofiles/getallpendingseller",
        params: { PageNumber: 1, PageSize: 100 },
      }),
      transformResponse: (response: unknown) => unwrapPagedData<SellerProfileDto>(response),
      providesTags: ["Seller"],
    }),
    getMySellerProfile: builder.query<SellerProfileDto | null, void>({
      query: () => "/api/sellerprofiles/getmy",
      providesTags: ["Seller"],
    }),
    approveSeller: builder.mutation<SellerProfileDto, number>({
      query: (id) => ({
        url: `/api/sellerprofiles/pendingsellerrequestaccept?id=${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Seller"],
    }),
    rejectSeller: builder.mutation<SellerProfileDto, number>({
      query: (id) => ({
        url: `/api/sellerprofiles/pendingsellerrequestreject?id=${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Seller"],
    }),

    // ─── Admin ───
    getAdminUsers: builder.query<PagedResponse<UserDto>, PagedRequest | void>({
      query: (params) => ({
        url: "/api/admin/users",
        params: {
          PageNumber: params?.pageNumber ?? 1,
          PageSize: params?.pageSize ?? 10,
        },
      }),
      transformResponse: (response: unknown) => {
        const paged = response as PagedResponse<UserDto & { imgae?: string | null }>;
        return {
          ...paged,
          data: paged.data.map((user) => normalizeUserDto(user)),
        };
      },
      providesTags: ["Admin"],
    }),
    getAdminUserById: builder.query<UserDto, number>({
      query: (id) => `/api/admin/users/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Admin", id }],
    }),
    updateAdminUser: builder.mutation<UserDto, { id: number; data: AdminUpdateUserDto }>({
      query: ({ id, data }) => ({
        url: `/api/admin/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
    deleteAdminUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
    activateAdminUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/admin/users/${id}/activate`,
        method: "PUT",
      }),
      invalidatesTags: ["Admin"],
    }),

    // ─── Roles (no /api prefix) ───
    getRoles: builder.query<PagedResponse<RoleDto>, PagedRequest | void>({
      query: (params) => ({
        url: "/Role/GetAll",
        params: {
          PageNumber: params?.pageNumber ?? 1,
          PageSize: params?.pageSize ?? 10,
        },
      }),
      providesTags: ["Role"],
    }),
    createRole: builder.mutation<RoleDto, CreateRoleDto>({
      query: (body) => ({
        url: "/Role/Create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Role"],
    }),
    updateRole: builder.mutation<RoleDto, { id: number; data: UpdateRoleDto }>({
      query: ({ id, data }) => ({
        url: `/Role/Update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),
    deleteRole: builder.mutation<void, number>({
      query: (id) => ({
        url: `/Role/Delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetSellerOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderTrackingQuery,
  useUpdateOrderStatusMutation,
  useCreatePaymentMutation,
  useGetPaymentByOrderQuery,
  useConfirmPaymentQuery,
  useSendChatMessageMutation,
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useCreateSellerProfileMutation,
  useGetAllSellerProfilesQuery,
  useGetPendingSellersQuery,
  useGetMySellerProfileQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
  useGetAdminUsersQuery,
  useGetAdminUserByIdQuery,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useActivateAdminUserMutation,
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = api;
