# E-Commerce Backend API Documentation

> **Version:** 1.0  
> **Last Updated:** June 16, 2026  
> **Tech Stack:** ASP.NET Core Web API + JWT Authentication + SQL Server

---

## Table of Contents

1. [Overview](#overview)
2. [Base URL & Environment](#base-url--environment)
3. [Authentication](#authentication)
4. [Common Patterns](#common-patterns)
5. [API Endpoints](#api-endpoints)
   - [Auth](#1-auth)
   - [User Profile](#2-user-profile)
   - [Products](#3-products)
   - [Categories](#4-categories)
   - [Cart](#5-cart)
   - [Orders](#6-orders)
   - [Order Tracking](#7-order-tracking)
   - [Payments](#8-payments)
   - [Reviews](#9-reviews)
   - [Seller Profiles](#10-seller-profiles)
   - [Admin](#11-admin)
   - [Roles](#12-roles)
6. [Data Models (DTOs)](#data-models-dtos)
7. [User Roles & Permissions](#user-roles--permissions)
8. [Frontend Integration Notes](#frontend-integration-notes)
9. [User Flows](#user-flows)
10. [Error Handling](#error-handling)

---

## Overview

This document describes all REST API endpoints for the E-Commerce backend. Use it to integrate the frontend (React/Next.js) with the .NET API.

**Swagger UI (interactive testing):** Run the backend and open `http://localhost:5241/swagger`

---

## Base URL & Environment

| Environment | URL |
|-------------|-----|
| HTTP (Development) | `http://localhost:5241` |
| HTTPS (Development) | `https://localhost:7109` |
| Swagger | `http://localhost:5241/swagger` |

**Frontend `.env` example:**

```env
BACKEND_API_URL=http://localhost:5241
```

---

## Authentication

Protected endpoints require a JWT token in the request header:

```http
Authorization: Bearer <your_jwt_token>
```

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Store this token and send it on every protected request.

---

## Common Patterns

### Pagination

Most list endpoints accept query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `PageNumber` | int | 1 | Page number (1-based) |
| `PageSize` | int | 10 | Items per page |

**Example:**

```http
GET /api/product/getall?PageNumber=1&PageSize=12
```

**Paged response shape:**

```json
{
  "pageNumber": 1,
  "pageSize": 12,
  "totalRecords": 48,
  "data": []
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 204 | Success, no body (e.g. DELETE) |
| 400 | Bad request / validation error |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (wrong role) |
| 404 | Resource not found |

---

## API Endpoints

### 1. Auth

**Base path:** `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT |
| GET | `/api/auth/users` | Public | List all users (paginated) |
| GET | `/api/auth/admin` | Admin | Test admin access |
| GET | `/api/auth/user` | User | Test user access |

#### POST `/api/auth/register`

> **Important:** Uses `application/x-www-form-urlencoded`, **not** JSON.

**Request headers:**

```http
Content-Type: application/x-www-form-urlencoded
```

**Request body:**

```
FullName=John Doe&Email=john@example.com&Password=password123
```

**Validation:**

- `FullName` — required
- `Email` — required, valid email format
- `Password` — required, minimum 6 characters

**Response (200 OK):** Returns the registered user data (`RegisterDto`).

---

#### POST `/api/auth/login`

**Request:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:** `401` — invalid credentials

---

#### GET `/api/auth/users`

**Query:** `PageNumber`, `PageSize`

**Response:** `PagedResponse<UserDto>`

---

### 2. User Profile

**Base path:** `/api/user`  
**Auth:** Any logged-in user

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get current user profile |
| PUT | `/api/user/update-profile` | Update name and/or password |

#### GET `/api/user/profile`

**Response (200 OK):**

```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "roleName": "User",
  "isActive": true,
  "imgae": null,
  "createdDate": "2026-01-15T10:00:00Z",
  "updateDate": null
}
```

---

#### PUT `/api/user/update-profile`

**Request:**

```json
{
  "fullName": "John Updated",
  "newPassword": "newpass123"
}
```

> `newPassword` is optional. Omit it to keep the current password.

**Response (200 OK):** Updated `UserDto`

---

### 3. Products

**Base path:** `/api/product`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/product/getall` | Public | List products (paginated) |
| GET | `/api/product/getbyid/{id}` | Public | Get single product |
| POST | `/api/product/create` | Seller | Create product |
| PUT | `/api/product/update/{id}` | Seller | Update product |
| DELETE | `/api/product/delete/{id}` | Seller | Delete product |

#### GET `/api/product/getall`

**Query:** `PageNumber`, `PageSize`

**Response:** `PagedResponse<ProductDto>`

---

#### GET `/api/product/getbyid/{id}`

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "iPhone 15",
  "description": "Latest Apple smartphone",
  "price": 99999.99,
  "stock": 50,
  "isActive": true,
  "image": "https://example.com/image.jpg",
  "categoryId": 1,
  "categoryName": "Electronics",
  "sellerName": "Tech Store",
  "sellerId": 2
}
```

---

#### POST `/api/product/create` (Seller only)

**Request:**

```json
{
  "name": "iPhone 15",
  "description": "Latest Apple smartphone",
  "price": 99999.99,
  "stock": 50,
  "image": "https://example.com/image.jpg",
  "categoryId": 1
}
```

**Validation:**

- `name` — required, min 2 characters
- `price` — required, > 0
- `stock` — required, >= 0

---

#### PUT `/api/product/update/{id}` (Seller only)

**Request:** Same as create, plus:

```json
{
  "name": "iPhone 15 Pro",
  "description": "Updated description",
  "price": 109999.99,
  "stock": 30,
  "image": "...",
  "categoryId": 1,
  "isActive": true
}
```

---

#### DELETE `/api/product/delete/{id}` (Seller only)

**Response:** `204 No Content`

---

### 4. Categories

**Base path:** `/api/categories`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories/getall` | Public | List categories |
| GET | `/api/categories/getbyid/{id}` | Public | Get category by ID |
| POST | `/api/categories/create` | Admin | Create category |
| PUT | `/api/categories/update/{id}` | Admin | Update category |
| DELETE | `/api/categories/delete/{id}` | Admin | Delete category |

#### POST `/api/categories/create` (Admin only)

**Request:**

```json
{
  "name": "Electronics"
}
```

---

#### PUT `/api/categories/update/{id}` (Admin only)

**Request:**

```json
{
  "name": "Electronics & Gadgets",
  "isActive": true
}
```

---

### 5. Cart

**Base path:** `/api/cart`  
**Auth:** User role required

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/get` | Get current user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update` | Update item quantity |
| DELETE | `/api/cart/remove/{cartItemId}` | Remove item from cart |

#### GET `/api/cart/get`

**Response (200 OK):**

```json
{
  "id": 1,
  "userId": 1,
  "userName": "John Doe",
  "items": [
    {
      "id": 5,
      "productId": 1,
      "productName": "iPhone 15",
      "quantity": 2,
      "price": 99999.99
    }
  ],
  "totalAmount": 199999.98
}
```

---

#### POST `/api/cart/add`

**Request:**

```json
{
  "productId": 1,
  "quantity": 2
}
```

---

#### PUT `/api/cart/update`

**Request:**

```json
{
  "cartItemId": 5,
  "quantity": 3
}
```

---

#### DELETE `/api/cart/remove/{cartItemId}`

**Response (200 OK):** Updated `CartDto`

---

### 6. Orders

**Base path:** `/api/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders/create` | User | Create order from cart |
| GET | `/api/orders/getmyorders` | User | User's orders |
| GET | `/api/orders/getsellerorders/seller` | Seller | Seller's orders |
| GET | `/api/orders/getall` | Admin | All orders |
| GET | `/api/orders/getbyid/{id}` | Logged-in | Order details |

#### POST `/api/orders/create` (User only)

Creates an order from the current cart. No request body required (send empty `{}`).

**Response (200 OK):**

```json
{
  "id": 1,
  "userId": 1,
  "totalAmount": 199999.98,
  "status": "Pending",
  "createdDate": "2026-06-16T12:00:00Z",
  "items": [
    {
      "productId": 1,
      "productName": "iPhone 15",
      "quantity": 2,
      "price": 99999.99
    }
  ]
}
```

---

#### GET `/api/orders/getmyorders` (User only)

**Query:** `PageNumber`, `PageSize`

**Response:** `PagedResponse<OrderDto>`

---

#### GET `/api/orders/getsellerorders/seller` (Seller only)

**Query:** `PageNumber`, `PageSize`

**Response:** `PagedResponse<OrderDto>`

---

#### GET `/api/orders/getall` (Admin only)

**Query:** `PageNumber`, `PageSize`

**Response:** `PagedResponse<OrderDto>`

---

#### GET `/api/orders/getbyid/{id}`

Accessible by User (own orders), Seller (their products), or Admin (all).

---

### 7. Order Tracking

**Base path:** `/api/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/orders/{id}/tracking` | Logged-in | Order status history |

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "orderId": 5,
    "status": "Pending",
    "createdDate": "2026-06-16T10:00:00Z"
  },
  {
    "id": 2,
    "orderId": 5,
    "status": "Shipped",
    "createdDate": "2026-06-17T14:00:00Z"
  }
]
```

---

### 8. Payments

**Base path:** `/api/payments`  
**Auth:** User, Admin, or Seller

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments` | Create payment for order |
| GET | `/api/payments/{orderId}` | Get payment by order ID |

#### POST `/api/payments`

**Request:**

```json
{
  "orderId": 1,
  "amount": 199999.98,
  "paymentMethod": "Card"
}
```

**Validation:**

- `orderId` — required
- `amount` — required, > 0
- `paymentMethod` — required (e.g. `"Card"`, `"Cash"`, `"Bank Transfer"`)

**Response (200 OK):**

```json
{
  "id": 1,
  "orderId": 1,
  "amount": 199999.98,
  "paymentMethod": "Card",
  "transactionId": "TXN-ABC123",
  "status": "Completed",
  "paidAt": "2026-06-16T12:30:00Z"
}
```

---

### 9. Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products/{productId}/reviews` | Public | Product reviews |
| POST | `/api/reviews` | User | Add review |
| DELETE | `/api/reviews/{id}` | Logged-in | Delete review |

#### GET `/api/products/{productId}/reviews`

**Query:** `PageNumber`, `PageSize`

**Response:** `PagedResponse<ReviewDto>`

```json
{
  "pageNumber": 1,
  "pageSize": 10,
  "totalRecords": 3,
  "data": [
    {
      "id": 1,
      "productId": 1,
      "userId": 2,
      "rating": 5,
      "comment": "Excellent product!",
      "createdDate": "2026-06-10T08:00:00Z"
    }
  ]
}
```

---

#### POST `/api/reviews` (User only)

**Request:**

```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Great product, fast delivery!"
}
```

**Validation:**

- `productId` — required
- `rating` — required, 1–5
- `comment` — optional

---

#### DELETE `/api/reviews/{id}`

User can delete own review; Admin can delete any review.

**Response:** `204 No Content`

---

### 10. Seller Profiles

**Base path:** `/api/sellerprofiles`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/sellerprofiles/create` | User | Apply to become seller |
| GET | `/api/sellerprofiles/getall` | Admin | All seller profiles |
| GET | `/api/sellerprofiles/getallpendingseller` | Admin | Pending seller requests |
| POST | `/api/sellerprofiles/pendingsellerrequestaccept?id={id}` | Admin | Approve seller |
| POST | `/api/sellerprofiles/pendingsellerrequestreject?id={id}` | Admin | Reject seller |

#### POST `/api/sellerprofiles/create` (User only)

**Request:**

```json
{
  "storeName": "My Tech Store",
  "storeDescription": "Best electronics in town",
  "storeAddress": "123 Main St, Karachi",
  "phoneNumber": "03001234567"
}
```

**Validation:**

- `storeName` — required, min 2 characters
- Other fields — optional

---

#### POST `/api/sellerprofiles/pendingsellerrequestaccept?id={id}` (Admin only)

**Query parameter:** `id` — seller profile ID to approve

**Response:** Updated `SellerProfileDto`

---

#### POST `/api/sellerprofiles/pendingsellerrequestreject?id={id}` (Admin only)

**Query parameter:** `id` — seller profile ID to reject

---

**SellerProfileDto response:**

```json
{
  "id": 1,
  "userId": 5,
  "storeName": "My Tech Store",
  "storeDescription": "Best electronics",
  "storeAddress": "123 Main St",
  "phoneNumber": "03001234567",
  "status": 1,
  "statusName": "Pending",
  "isActive": true,
  "userName": "John Doe",
  "roleName": "User",
  "createdDate": "2026-06-16T10:00:00Z",
  "approvedBy": null,
  "approvedAt": null
}
```

---

### 11. Admin

**Base path:** `/api/admin`  
**Auth:** Admin only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/users/{id}` | Get user by ID |
| PUT | `/api/admin/users/{id}` | Update user |
| DELETE | `/api/admin/users/{id}` | Delete user |

#### GET `/api/admin/users`

**Query:** `PageNumber`, `PageSize`

**Response:** `PagedResponse<UserDto>`

---

#### PUT `/api/admin/users/{id}`

**Request:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "roleId": 2
}
```

**Validation:**

- `fullName` — required, min 2 characters
- `email` — required, valid email
- `roleId` — required

---

#### DELETE `/api/admin/users/{id}`

**Response:** `204 No Content`

---

### 12. Roles

**Base path:** `/api/role`  
**Auth:** Admin only

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/role` | Create role |
| GET | `/api/role` | List roles (paginated) |
| GET | `/api/role/{id}` | Get role by ID |
| PUT | `/api/role/{id}` | Update role |
| DELETE | `/api/role/{id}` | Delete role |

#### POST `/api/role`

**Request:**

```json
{
  "name": "Manager"
}
```

---

#### PUT `/api/role/{id}`

**Request:**

```json
{
  "name": "Manager",
  "isActive": true
}
```

---

## Data Models (DTOs)

### UserDto

```typescript
{
  id: number;
  fullName: string;
  email: string;
  roleName: string;      // "Admin" | "User" | "Seller"
  isActive: boolean;
  imgae: string | null;  // note: typo in backend field name
  createdDate: string | null;
  updateDate: string | null;
}
```

### ProductDto

```typescript
{
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
```

### CategoryDto

```typescript
{
  id: number;
  name: string;
  isActive: boolean;
}
```

### CartDto

```typescript
{
  id: number;
  userId: number;
  userName: string;
  items: CartItemDto[];
  totalAmount: number;
}

// CartItemDto
{
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}
```

### OrderDto

```typescript
{
  id: number;
  userId: number;
  totalAmount: number;
  status: string;        // e.g. "Pending", "Shipped", "Delivered"
  createdDate: string | null;
  items: OrderItemDto[];
}

// OrderItemDto
{
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}
```

### PaymentDto

```typescript
{
  id: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: string;
  paidAt: string | null;
}
```

### ReviewDto

```typescript
{
  id: number;
  productId: number;
  userId: number;
  rating: number;        // 1-5
  comment: string;
  createdDate: string;
}
```

### SellerProfileDto

```typescript
{
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
```

### PagedResponse\<T\>

```typescript
{
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  data: T[];
}
```

---

## User Roles & Permissions

| Role | Access |
|------|--------|
| **Public** | Register, Login, Browse products & categories, View reviews |
| **User** | Cart, Orders, Payments, Reviews, Profile, Apply as Seller |
| **Seller** | Create/Update/Delete own products, View seller orders |
| **Admin** | Manage users, categories, roles, approve/reject sellers, view all orders |

---

## Frontend Integration Notes

### 1. Register uses form-urlencoded

The register endpoint expects `application/x-www-form-urlencoded`, not JSON:

```javascript
const body = new URLSearchParams();
body.append("FullName", "John Doe");
body.append("Email", "john@example.com");
body.append("Password", "password123");

fetch("http://localhost:5241/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: body.toString(),
});
```

### 2. URL casing

ASP.NET Core routes are case-insensitive. Both work:

- `/api/Product/GetAll`
- `/api/product/getall`

### 3. CORS

CORS is **not** configured on the backend. Options:

- **Option A:** Add CORS in backend `Program.cs` for direct browser calls
- **Option B:** Use a BFF (Backend-for-Frontend) proxy — the existing Next.js app in `FrontEnd/` already does this via `/api/bff/*` routes

### 4. Existing frontend services

Reference implementations are in `FrontEnd/services/`:

| File | Covers |
|------|--------|
| `auth.service.ts` | Login, Register, Users |
| `user.service.ts` | Profile |
| `product.service.ts` | Products CRUD |
| `category.service.ts` | Categories CRUD |
| `cart.service.ts` | Cart operations |
| `order.service.ts` | Orders & tracking |
| `payment.service.ts` | Payments |
| `review.service.ts` | Reviews |
| `sellerProfile.service.ts` | Seller profiles |
| `admin.service.ts` | Admin user management |

### 5. Axios example (with auth)

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5241",
  headers: { "Content-Type": "application/json" },
});

// Attach token after login
api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// Example: get products
const { data } = await api.get("/api/product/getall", {
  params: { PageNumber: 1, PageSize: 12 },
});
```

---

## User Flows

### Customer flow

```
Register → Login → Browse Products → View Product Details
    → Add to Cart → View Cart → Create Order → Make Payment → Track Order
    → Write Review
```

### Become a seller

```
Login (as User) → Submit Seller Profile → Wait for Admin Approval
    → Role changes to Seller → Add/Manage Products → View Store Orders
```

### Admin flow

```
Login (as Admin) → Manage Users → Manage Categories
    → Review Pending Seller Requests → Approve/Reject
    → View All Orders
```

---

## Error Handling

### Validation errors (400)

```json
{
  "fullName": ["Full name is required"],
  "email": ["Invalid email format"]
}
```

### Unauthorized (401)

```json
"Invalid email or password."
```

### Not found (404)

Empty body or standard ASP.NET not-found response.

### Frontend tip

Always check `response.status` and handle 401 by redirecting to login.

---

## Quick Reference — All Endpoints

| # | Method | Endpoint | Auth |
|---|--------|----------|------|
| 1 | POST | `/api/auth/register` | Public |
| 2 | POST | `/api/auth/login` | Public |
| 3 | GET | `/api/auth/users` | Public |
| 4 | GET | `/api/user/profile` | User+ |
| 5 | PUT | `/api/user/update-profile` | User+ |
| 6 | GET | `/api/product/getall` | Public |
| 7 | GET | `/api/product/getbyid/{id}` | Public |
| 8 | POST | `/api/product/create` | Seller |
| 9 | PUT | `/api/product/update/{id}` | Seller |
| 10 | DELETE | `/api/product/delete/{id}` | Seller |
| 11 | GET | `/api/categories/getall` | Public |
| 12 | GET | `/api/categories/getbyid/{id}` | Public |
| 13 | POST | `/api/categories/create` | Admin |
| 14 | PUT | `/api/categories/update/{id}` | Admin |
| 15 | DELETE | `/api/categories/delete/{id}` | Admin |
| 16 | GET | `/api/cart/get` | User |
| 17 | POST | `/api/cart/add` | User |
| 18 | PUT | `/api/cart/update` | User |
| 19 | DELETE | `/api/cart/remove/{cartItemId}` | User |
| 20 | POST | `/api/orders/create` | User |
| 21 | GET | `/api/orders/getmyorders` | User |
| 22 | GET | `/api/orders/getsellerorders/seller` | Seller |
| 23 | GET | `/api/orders/getall` | Admin |
| 24 | GET | `/api/orders/getbyid/{id}` | User+ |
| 25 | GET | `/api/orders/{id}/tracking` | User+ |
| 26 | POST | `/api/payments` | User+ |
| 27 | GET | `/api/payments/{orderId}` | User+ |
| 28 | GET | `/api/products/{productId}/reviews` | Public |
| 29 | POST | `/api/reviews` | User |
| 30 | DELETE | `/api/reviews/{id}` | User+ |
| 31 | POST | `/api/sellerprofiles/create` | User |
| 32 | GET | `/api/sellerprofiles/getall` | Admin |
| 33 | GET | `/api/sellerprofiles/getallpendingseller` | Admin |
| 34 | POST | `/api/sellerprofiles/pendingsellerrequestaccept?id={id}` | Admin |
| 35 | POST | `/api/sellerprofiles/pendingsellerrequestreject?id={id}` | Admin |
| 36 | GET | `/api/admin/users` | Admin |
| 37 | GET | `/api/admin/users/{id}` | Admin |
| 38 | PUT | `/api/admin/users/{id}` | Admin |
| 39 | DELETE | `/api/admin/users/{id}` | Admin |
| 40 | POST | `/api/role` | Admin |
| 41 | GET | `/api/role` | Admin |
| 42 | GET | `/api/role/{id}` | Admin |
| 43 | PUT | `/api/role/{id}` | Admin |
| 44 | DELETE | `/api/role/{id}` | Admin |

> **User+** = Any logged-in user (User, Seller, or Admin)

---

*Generated from E-Commerce .NET Backend source code.*
