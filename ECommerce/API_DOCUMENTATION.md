# ECommerce Platform — API Documentation

> **Frontend developers ke liye:** Yeh document saari backend APIs, authentication, request/response formats aur roles cover karta hai.

---

## Base URL

| Environment | URL |
|-------------|-----|
| Development (HTTP) | `http://localhost:5241` |
| Development (HTTPS) | `https://localhost:7109` |
| Swagger UI | `{BASE_URL}/swagger` |

**API Prefix:** `/api`

---

## Authentication

Zyaada tar protected endpoints ke liye **JWT Bearer Token** required hai.

### Header format

```
Authorization: Bearer {your_jwt_token}
Content-Type: application/json
```

### Roles

| Role | Description |
|------|-------------|
| `User` | Normal customer — cart, orders, reviews |
| `Seller` | Product seller — products manage, seller orders |
| `Admin` | Full admin — users, roles, categories, seller approval |

### Login response

Login successful hone par token milta hai. Is token ko har protected request ke `Authorization` header mein bhejein.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Common Types

### Pagination — Query Parameters

Har paginated list endpoint par yeh query params use karein:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pageNumber` | int | `1` | Page number |
| `pageSize` | int | `10` | Items per page |

**Example:** `GET /api/Product/GetAll?pageNumber=1&pageSize=20`

### Pagination — Response

```json
{
  "pageNumber": 1,
  "pageSize": 10,
  "totalRecords": 50,
  "data": [ /* array of items */ ]
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `204` | Success, no content (delete operations) |
| `400` | Validation error / bad request |
| `401` | Unauthorized (invalid/missing token) |
| `403` | Forbidden (wrong role) |
| `404` | Resource not found |

---

## 1. Auth APIs

**Base route:** `/api/Auth`

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 1 | POST | `/api/Auth/register` | No | — | Naya user register karein |
| 2 | POST | `/api/Auth/login` | No | — | Login aur JWT token lein |
| 3 | GET | `/api/Auth/admin` | Yes | Admin | Admin test endpoint |
| 4 | GET | `/api/Auth/user` | Yes | User | User test endpoint |
| 5 | GET | `/api/Auth/users` | No | — | Saare users (paginated) |

### 1.1 Register

```
POST /api/Auth/register
Content-Type: application/json   (or multipart/form-data — backend [FromForm] use karta hai)
```

**Request body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| fullName | string | Yes | Required |
| email | string | Yes | Valid email format |
| password | string | Yes | Min 6 characters |

**Response `200`:** Registered user data (RegisterDto)

**Errors:** `400` — email already exists / validation fail

---

### 1.2 Login

```
POST /api/Auth/login
Content-Type: application/json
```

**Request body:**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response `200`:**

```json
{
  "token": "jwt_token_string"
}
```

**Errors:** `401` — invalid email/password | `400` — other errors

---

### 1.3 Get Users (Paginated)

```
GET /api/Auth/users?pageNumber=1&pageSize=10
```

**Response `200`:** `PagedResponse<UserDto>`

**UserDto:**

```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "roleName": "User",
  "isActive": true,
  "imgae": null,
  "createdDate": "2025-01-01T00:00:00",
  "createdBy": null,
  "updateDate": null,
  "updateBy": null
}
```

---

## 2. User Profile APIs

**Base route:** `/api/User`  
**Auth:** Bearer token required (koi bhi logged-in user)

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/api/User/profile` | Apna profile dekhein |
| 2 | PUT | `/api/User/update-profile` | Profile update karein |

### 2.1 Get Profile

```
GET /api/User/profile
Authorization: Bearer {token}
```

**Response `200`:** User profile object  
**Response `404`:** Profile not found

---

### 2.2 Update Profile

```
PUT /api/User/update-profile
Authorization: Bearer {token}
```

**Request body:**

```json
{
  "fullName": "Updated Name",
  "newPassword": "newpass123"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| fullName | string | Yes | — |
| newPassword | string | No | Min 6 chars; blank chhor dein agar change na karna ho |

**Response `200`:** Updated profile  
**Response `404`:** User not found

---

## 3. Product APIs

**Base route:** `/api/Product`

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 1 | POST | `/api/Product/Create` | Yes | Seller | Naya product |
| 2 | GET | `/api/Product/GetAll` | No | — | Products list (paginated) |
| 3 | GET | `/api/Product/GetById/{id}` | No | — | Single product |
| 4 | PUT | `/api/Product/Update/{id}` | Yes | Seller | Product update |
| 5 | DELETE | `/api/Product/Delete/{id}` | Yes | Seller | Product delete |

### 3.1 Create Product

```
POST /api/Product/Create
Authorization: Bearer {token}
```

**Request body:**

```json
{
  "name": "iPhone 15",
  "description": "Latest model",
  "price": 999.99,
  "stock": 50,
  "image": "https://example.com/image.jpg",
  "categoryId": 1
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | Min 2 chars |
| description | string | No | — |
| price | decimal | Yes | > 0 |
| stock | int | Yes | >= 0 |
| image | string | No | URL/path |
| categoryId | int | No | — |

**Response `200`:** `ProductDto`

---

### 3.2 Get All Products

```
GET /api/Product/GetAll?pageNumber=1&pageSize=10
```

**Response `200`:** `PagedResponse<ProductDto>`

**ProductDto:**

```json
{
  "id": 1,
  "name": "iPhone 15",
  "description": "Latest model",
  "price": 999.99,
  "stock": 50,
  "isActive": true,
  "image": "url",
  "categoryId": 1,
  "categoryName": "Electronics",
  "sellerName": "Tech Store",
  "sellerId": 5
}
```

---

### 3.3 Get Product By ID

```
GET /api/Product/GetById/1
```

**Response `200`:** `ProductDto`  
**Response `404`:** Not found

---

### 3.4 Update Product

```
PUT /api/Product/Update/1
Authorization: Bearer {token}
```

**Request body:** Same as Create + `isActive` (boolean, default `true`)

**Response `200`:** Updated `ProductDto`  
**Response `404`:** Not found

---

### 3.5 Delete Product

```
DELETE /api/Product/Delete/1
Authorization: Bearer {token}
```

**Response `204`:** Deleted successfully

---

## 4. Category APIs

**Base route:** `/api/Categories`

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 1 | POST | `/api/Categories/Create` | Yes | Admin | Category create |
| 2 | GET | `/api/Categories/GetAll` | No | — | Categories list |
| 3 | GET | `/api/Categories/GetById/{id}` | No | — | Single category |
| 4 | PUT | `/api/Categories/Update/{id}` | Yes | Admin | Category update |
| 5 | DELETE | `/api/Categories/Delete/{id}` | Yes | Admin | Category delete |

### 4.1 Create Category

**Request body:**

```json
{
  "name": "Electronics"
}
```

**Response `200`:** `CategoryDto`

---

### 4.2 Get All / Get By ID

**CategoryDto:**

```json
{
  "id": 1,
  "name": "Electronics",
  "isActive": true
}
```

### 4.3 Update Category

**Request body:**

```json
{
  "name": "Electronics",
  "isActive": true
}
```

---

## 5. Cart APIs

**Base route:** `/api/Cart`  
**Auth:** Bearer token | **Role:** `User`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | POST | `/api/Cart/Add` | Cart mein item add |
| 2 | GET | `/api/Cart/Get` | Apna cart dekhein |
| 3 | PUT | `/api/Cart/Update` | Item quantity update |
| 4 | DELETE | `/api/Cart/Remove/remove/{cartItemId}` | Item remove |

### 5.1 Add to Cart

**Request body:**

```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response `200`:** `CartDto`

---

### 5.2 Get Cart

**Response `200`:**

```json
{
  "id": 1,
  "userId": 5,
  "userName": "John Doe",
  "items": [
    {
      "id": 10,
      "productId": 1,
      "productName": "iPhone 15",
      "quantity": 2,
      "price": 999.99
    }
  ],
  "totalAmount": 1999.98
}
```

---

### 5.3 Update Cart Item

**Request body:**

```json
{
  "cartItemId": 10,
  "quantity": 3
}
```

---

### 5.4 Remove Cart Item

```
DELETE /api/Cart/Remove/remove/10
```

---

## 6. Order APIs

**Base route:** `/api/Orders`

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 1 | POST | `/api/Orders/Create` | Yes | User | Cart se order banayein |
| 2 | GET | `/api/Orders/GetMyOrders` | Yes | User | Apne orders |
| 3 | GET | `/api/Orders/GetSellerOrders/seller` | Yes | Seller | Seller ke orders |
| 4 | GET | `/api/Orders/GetAll` | Yes | Admin | Saare orders |
| 5 | GET | `/api/Orders/GetById/{id}` | Yes | Any | Order detail |

### 6.1 Create Order

```
POST /api/Orders/Create
Authorization: Bearer {token}
```

**Request body:** None (cart se automatically order banta hai)

**Response `200`:** `OrderDto`

---

### 6.2 Order Response Shape

```json
{
  "id": 1,
  "userId": 5,
  "totalAmount": 1999.98,
  "status": "Pending",
  "createdDate": "2025-06-15T10:00:00",
  "items": [
    {
      "productId": 1,
      "productName": "iPhone 15",
      "quantity": 2,
      "price": 999.99
    }
  ]
}
```

---

## 7. Order Tracking API

**Base route:** `/api/orders`

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 1 | GET | `/api/orders/{id}/tracking` | Yes | Order tracking history |

### Example

```
GET /api/orders/1/tracking
Authorization: Bearer {token}
```

**Response `200`:** Array of tracking entries (oldest first)

```json
[
  {
    "id": 1,
    "orderId": 1,
    "status": "Order Placed",
    "createdDate": "2025-06-15T10:00:00",
    "createdBy": 5,
    "updateDate": null,
    "updateBy": null
  },
  {
    "id": 2,
    "orderId": 1,
    "status": "Shipped",
    "createdDate": "2025-06-16T08:00:00",
    "createdBy": 1,
    "updateDate": null,
    "updateBy": null
  }
]
```

**Response `404`:** No tracking found

---

## 8. Payment APIs

**Base route:** `/api/Payments`  
**Auth:** Bearer token | **Roles:** `User`, `Admin`, `Seller`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | POST | `/api/Payments` | Payment create |
| 2 | GET | `/api/Payments/{orderId}` | Order ki payment detail |

### 8.1 Create Payment

**Request body:**

```json
{
  "orderId": 1,
  "amount": 1999.98,
  "paymentMethod": "CreditCard"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| orderId | int | Yes | — |
| amount | decimal | Yes | > 0 |
| paymentMethod | string | Yes | e.g. CreditCard, Cash, etc. |

**Response `200`:** `PaymentDto`

```json
{
  "id": 1,
  "orderId": 1,
  "amount": 1999.98,
  "paymentMethod": "CreditCard",
  "transactionId": "TXN123456",
  "status": "Completed",
  "paidAt": "2025-06-15T10:30:00"
}
```

---

## 9. Review APIs

**Base route:** `/api/Reviews`

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 1 | POST | `/api/Reviews` | Yes | User | Product review likhein |
| 2 | GET | `/api/products/{productId}/reviews` | No | — | Product reviews (paginated) |
| 3 | DELETE | `/api/Reviews/{id}` | Yes | Any | Review delete |

### 9.1 Create Review

**Request body:**

```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Great product!"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| productId | int | Yes | — |
| rating | int | Yes | 1–5 |
| comment | string | No | — |

**Response `200`:** `ReviewDto`

---

### 9.2 Get Product Reviews

```
GET /api/products/1/reviews?pageNumber=1&pageSize=10
```

**Response `200`:** `PagedResponse<ReviewDto>`

```json
{
  "id": 1,
  "productId": 1,
  "userId": 5,
  "rating": 5,
  "comment": "Great product!",
  "createdDate": "2025-06-15T12:00:00"
}
```

---

## 10. Seller Profile APIs

**Base route:** `/api/SellerProfiles`

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 1 | POST | `/api/SellerProfiles/Create` | Yes | User | Seller banne ki request |
| 2 | GET | `/api/SellerProfiles/GetAll` | Yes | Admin | Saare seller profiles |
| 3 | GET | `/api/SellerProfiles/GetAllPendingSeller` | Yes | Admin | Pending seller requests |
| 4 | POST | `/api/SellerProfiles/PendingSellerRequestAccept?id={id}` | Yes | Admin | Request approve |
| 5 | POST | `/api/SellerProfiles/PendingSellerRequestReject?id={id}` | Yes | Admin | Request reject |

### 10.1 Apply as Seller

**Request body:**

```json
{
  "storeName": "My Tech Store",
  "storeDescription": "Best gadgets",
  "storeAddress": "123 Main St",
  "phoneNumber": "+923001234567"
}
```

| Field | Type | Required |
|-------|------|----------|
| storeName | string | Yes (min 2 chars) |
| storeDescription | string | No |
| storeAddress | string | No |
| phoneNumber | string | No |

**Response `200`:** `SellerProfileDto`

```json
{
  "id": 1,
  "userId": 5,
  "storeName": "My Tech Store",
  "storeDescription": "Best gadgets",
  "storeAddress": "123 Main St",
  "phoneNumber": "+923001234567",
  "createdBy": 5,
  "status": 0,
  "isActive": false,
  "createdDate": "2025-06-15T00:00:00",
  "approvedBy": null,
  "approvedAt": null,
  "userName": "John Doe",
  "roleName": "User",
  "statusName": "Pending"
}
```

---

### 10.2 Accept / Reject Pending Seller

```
POST /api/SellerProfiles/PendingSellerRequestAccept?id=1
POST /api/SellerProfiles/PendingSellerRequestReject?id=1
Authorization: Bearer {admin_token}
```

**Query param:** `id` — Seller profile ID

---

## 11. Admin APIs

**Base route:** `/api/Admin`  
**Auth:** Bearer token | **Role:** `Admin`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/api/Admin/users` | Users list (paginated) |
| 2 | GET | `/api/Admin/users/{id}` | Single user |
| 3 | PUT | `/api/Admin/users/{id}` | User update |
| 4 | DELETE | `/api/Admin/users/{id}` | User delete |

### 11.1 Update User

**Request body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "roleId": 2
}
```

| Field | Type | Required |
|-------|------|----------|
| fullName | string | Yes (min 2) |
| email | string | Yes (valid email) |
| isActive | boolean | No (default true) |
| roleId | int | Yes |

---

## 12. Role APIs (Admin Only)

**Base route:** `/api/Role`  
**Auth:** Bearer token | **Role:** `Admin`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | POST | `/api/Role` | Role create |
| 2 | GET | `/api/Role` | Roles list (paginated) |
| 3 | GET | `/api/Role/{id}` | Single role |
| 4 | PUT | `/api/Role/{id}` | Role update |
| 5 | DELETE | `/api/Role/{id}` | Role delete |

### Create / Update Role

**Create request:**

```json
{
  "name": "Manager"
}
```

**Update request:**

```json
{
  "name": "Manager",
  "isActive": true
}
```

**RoleDto response:**

```json
{
  "id": 1,
  "name": "Admin",
  "isActive": true
}
```

---

## Quick Reference — All Endpoints

| Module | Method | Endpoint | Auth | Role |
|--------|--------|----------|------|------|
| Auth | POST | `/api/Auth/register` | No | — |
| Auth | POST | `/api/Auth/login` | No | — |
| Auth | GET | `/api/Auth/admin` | Yes | Admin |
| Auth | GET | `/api/Auth/user` | Yes | User |
| Auth | GET | `/api/Auth/users` | No | — |
| User | GET | `/api/User/profile` | Yes | Any |
| User | PUT | `/api/User/update-profile` | Yes | Any |
| Product | POST | `/api/Product/Create` | Yes | Seller |
| Product | GET | `/api/Product/GetAll` | No | — |
| Product | GET | `/api/Product/GetById/{id}` | No | — |
| Product | PUT | `/api/Product/Update/{id}` | Yes | Seller |
| Product | DELETE | `/api/Product/Delete/{id}` | Yes | Seller |
| Categories | POST | `/api/Categories/Create` | Yes | Admin |
| Categories | GET | `/api/Categories/GetAll` | No | — |
| Categories | GET | `/api/Categories/GetById/{id}` | No | — |
| Categories | PUT | `/api/Categories/Update/{id}` | Yes | Admin |
| Categories | DELETE | `/api/Categories/Delete/{id}` | Yes | Admin |
| Cart | POST | `/api/Cart/Add` | Yes | User |
| Cart | GET | `/api/Cart/Get` | Yes | User |
| Cart | PUT | `/api/Cart/Update` | Yes | User |
| Cart | DELETE | `/api/Cart/Remove/remove/{cartItemId}` | Yes | User |
| Orders | POST | `/api/Orders/Create` | Yes | User |
| Orders | GET | `/api/Orders/GetMyOrders` | Yes | User |
| Orders | GET | `/api/Orders/GetSellerOrders/seller` | Yes | Seller |
| Orders | GET | `/api/Orders/GetAll` | Yes | Admin |
| Orders | GET | `/api/Orders/GetById/{id}` | Yes | Any |
| Tracking | GET | `/api/orders/{id}/tracking` | Yes | Any |
| Payments | POST | `/api/Payments` | Yes | User/Admin/Seller |
| Payments | GET | `/api/Payments/{orderId}` | Yes | User/Admin/Seller |
| Reviews | POST | `/api/Reviews` | Yes | User |
| Reviews | GET | `/api/products/{productId}/reviews` | No | — |
| Reviews | DELETE | `/api/Reviews/{id}` | Yes | Any |
| SellerProfiles | POST | `/api/SellerProfiles/Create` | Yes | User |
| SellerProfiles | GET | `/api/SellerProfiles/GetAll` | Yes | Admin |
| SellerProfiles | GET | `/api/SellerProfiles/GetAllPendingSeller` | Yes | Admin |
| SellerProfiles | POST | `/api/SellerProfiles/PendingSellerRequestAccept?id={id}` | Yes | Admin |
| SellerProfiles | POST | `/api/SellerProfiles/PendingSellerRequestReject?id={id}` | Yes | Admin |
| Admin | GET | `/api/Admin/users` | Yes | Admin |
| Admin | GET | `/api/Admin/users/{id}` | Yes | Admin |
| Admin | PUT | `/api/Admin/users/{id}` | Yes | Admin |
| Admin | DELETE | `/api/Admin/users/{id}` | Yes | Admin |
| Role | POST | `/api/Role` | Yes | Admin |
| Role | GET | `/api/Role` | Yes | Admin |
| Role | GET | `/api/Role/{id}` | Yes | Admin |
| Role | PUT | `/api/Role/{id}` | Yes | Admin |
| Role | DELETE | `/api/Role/{id}` | Yes | Admin |

---

## Typical User Flow (Frontend)

```
1. POST /api/Auth/register          → Account banao
2. POST /api/Auth/login             → Token save karo (localStorage/sessionStorage)
3. GET  /api/Product/GetAll         → Products dikhao
4. GET  /api/Product/GetById/{id}   → Product detail
5. POST /api/Cart/Add               → Cart mein add (User token)
6. GET  /api/Cart/Get               → Cart page
7. POST /api/Orders/Create          → Checkout
8. POST /api/Payments               → Payment
9. GET  /api/orders/{id}/tracking   → Order track karo
10. POST /api/Reviews               → Review likho
```

### Seller Flow

```
1. POST /api/SellerProfiles/Create  → Seller request (User role se)
   → Admin approve karega
2. POST /api/Auth/login             → Seller token (role change ke baad)
3. POST /api/Product/Create         → Product add
4. GET  /api/Orders/GetSellerOrders/seller → Seller orders
```

### Admin Flow

```
1. GET  /api/SellerProfiles/GetAllPendingSeller  → Pending sellers
2. POST /api/SellerProfiles/PendingSellerRequestAccept?id={id}
3. GET  /api/Admin/users                         → User management
4. POST /api/Categories/Create                   → Categories
5. GET  /api/Orders/GetAll                       → All orders
```

---

## Notes for Frontend Team

1. **Register endpoint** backend par `[FromForm]` hai — agar JSON se issue aaye to `multipart/form-data` ya form fields try karein.
2. **JWT token** har protected API ke liye `Authorization: Bearer {token}` header zaroori hai.
3. **Swagger** development mein available hai: `http://localhost:5241/swagger` — live testing ke liye use kar sakte hain.
4. Validation errors `400` par `ModelState` object ke format mein aate hain.
5. **CORS:** Agar frontend alag port par hai to backend team se CORS enable karwana hoga.

---

*Document generated from ECommerce .NET backend codebase.*
