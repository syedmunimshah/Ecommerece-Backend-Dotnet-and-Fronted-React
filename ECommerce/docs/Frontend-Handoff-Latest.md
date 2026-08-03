# EdgeCart — Latest Changes (Frontend Handoff)

> **Date:** 29 June 2026  
> **Backend:** `http://localhost:5241`  
> **Frontend:** `http://localhost:3000`  
> **Swagger:** `http://localhost:5241/swagger`

Yeh document **recent backend + frontend integration changes** ka summary hai. Poori API detail ke liye: `docs/Frontend-Changes-Handoff.md`.

---

## 1. Environment Setup (Zaroori)

Frontend `.env.local`:

```env
BACKEND_API_URL=http://localhost:5241
NEXT_PUBLIC_API_URL=/bff
```

- Browser se calls **`/bff/...`** par jati hain (Next.js rewrite → backend `5241`)
- Direct `http://localhost:5241` browser se mat use karo (CORS issues)

Har protected request:

```http
Authorization: Bearer <jwt_token>
```

---

## 2. Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@edgecart.com` | `Password123` |
| Customer (User) | `ali@edgecart.com` | `Password123` |
| Seller | `seller1@edgecart.com` | `Password123` |

JWT claim `role` values: `"Admin"` | `"User"` | `"Seller"`

---

## 3. Authentication Changes

### 3.1 Login response (UPDATED)

```http
POST /bff/api/auth/login
Content-Type: application/json
```

```json
{ "email": "ali@edgecart.com", "password": "Password123" }
```

**Response `200`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 7200
}
```

| Change | Detail |
|--------|--------|
| **REMOVED** | `refreshToken` field |
| **REMOVED** | `POST /api/auth/refresh-token` |
| **Action** | Token expire → login page. Refresh-token logic hata do. |

---

### 3.2 Forgot Password — 4-digit OTP (NEW)

```http
POST /bff/api/auth/forgot-password
Content-Type: application/json
```

```json
{ "email": "ali@edgecart.com" }
```

**Response `200` (hamesha — security):**

```json
{
  "message": "If an account exists for this email, a 4-digit OTP has been sent (max 5 per day)."
}
```

| Rule | Value |
|------|-------|
| OTP | **4 digits** (e.g. `1190`) |
| Expiry | **10 minutes** |
| Daily limit | **5 requests / day** per email |
| 6th request | OTP nahi bhejta — same success message |

**UI flow:**

1. Forgot password → email enter
2. Reset password → email + 4-digit OTP + new password + confirm
3. "Request new OTP" link

**Email note (dev):**

- Production / SMTP on → OTP **email** par aata hai (`EdgeCart — Password Reset OTP`)
- Dev mein SMTP off ho to OTP backend **console** mein print hota hai — browser console mein nahi

---

### 3.3 Reset Password (UPDATED)

```http
POST /bff/api/auth/reset-password
Content-Type: application/json
```

```json
{
  "email": "ali@edgecart.com",
  "otp": "1190",
  "newPassword": "NewPass@123"
}
```

**Response `200`:**

```json
{ "message": "Password has been reset successfully." }
```

**Error `400`:** `"Invalid or expired OTP."`

| BREAKING | Pehle `token` field thi — ab **`otp`** (4 digits) |

---

## 4. Role-Based API Rules (IMPORTANT — 500 errors avoid karo)

Kuch endpoints **sirf specific role** ke liye hain. Galat role se call karoge to **403** ya pehle **500** aa sakta tha.

| Endpoint | Role required | Kab call karo |
|----------|---------------|---------------|
| `GET /bff/api/cart/get` | **User** | Sirf customer login |
| `POST /bff/api/cart/add` | **User** | Sirf customer |
| `GET /bff/api/orders/getmyorders` | **User** | Sirf customer dashboard |
| `GET /bff/api/orders/getall` | **Admin** | Admin orders page |
| `GET /bff/api/orders/getsellerorders/seller` | **Seller** | Seller dashboard |
| `GET /bff/Role/GetAll` | **Admin** | Admin roles page |

### Frontend rule (RTK Query `skip`)

```typescript
const { isAuthenticated, isUser, isAdmin, isSeller } = useAuth();

// Cart — sirf User
useGetCartQuery(undefined, { skip: !isAuthenticated || !isUser });

// My orders — sirf User
useGetMyOrdersQuery(params, { skip: !isAuthenticated || !isUser });

// All orders — sirf Admin
useGetAllOrdersQuery(params, { skip: !isAuthenticated || !isAdmin });

// Roles — sirf Admin
useGetRolesQuery(params, { skip: !isAuthenticated || !isAdmin });
```

**Admin / Seller login par cart ya getmyorders mat fetch karo** — network errors aur "Could not load" messages isi wajah se aate thay.

---

## 5. Fixed Endpoints (Exact URLs)

### 5.1 Admin Roles (NO `/api` prefix)

```http
GET /bff/Role/GetAll?PageNumber=1&PageSize=20
Authorization: Bearer <admin_token>
```

**Response `200`:**

```json
{
  "pageNumber": 1,
  "pageSize": 20,
  "totalRecords": 3,
  "data": [
    { "id": 1, "name": "Admin", "isActive": true },
    { "id": 2, "name": "User", "isActive": true },
    { "id": 3, "name": "Seller", "isActive": true }
  ]
}
```

**Backend fix:** AutoMapper `Role → RoleDto` mapping add ki — pehle yahan **500** aa raha tha.

**Other Role endpoints:**

| Method | URL |
|--------|-----|
| POST | `/bff/Role/Create` |
| PUT | `/bff/Role/Update/{id}` |
| DELETE | `/bff/Role/Delete/{id}` |

---

### 5.2 Orders (explicit routes)

```http
GET /bff/api/orders/getmyorders?PageNumber=1&PageSize=10   → User
GET /bff/api/orders/getall?PageNumber=1&PageSize=20        → Admin
GET /bff/api/orders/getsellerorders/seller?PageNumber=1&PageSize=10 → Seller
GET /bff/api/orders/getbyid/{id}
GET /bff/api/orders/{id}/tracking
PUT /bff/api/orders/{id}/status                            → Admin, Seller
POST /bff/api/orders/create                                → User
```

Query params: `PageNumber`, `PageSize` (PascalCase ya camelCase dono chalte hain).

---

### 5.3 Cart

```http
GET  /bff/api/cart/get              → User only
POST /bff/api/cart/add
PUT  /bff/api/cart/update
DELETE /bff/api/cart/remove/remove/{cartItemId}
```

**Empty cart response (no cart yet):**

```json
{
  "userId": 3,
  "items": [],
  "totalAmount": 0
}
```

---

## 6. JSON & Paging Rules

| Rule | Example |
|------|---------|
| camelCase responses | `pageNumber`, `totalRecords`, `isActive`, `userName` |
| Paged lists | `{ pageNumber, pageSize, totalRecords, data: [] }` |
| Plain array nahi | Hamesha `.data` use karo lists ke liye |

```typescript
// RTK Query se
const roles = data?.data ?? [];
const total = data?.totalRecords ?? 0;
```

---

## 7. Product Search & Filters (Phase 2)

```http
GET /bff/api/product/getall?PageNumber=1&PageSize=12&search=iphone
GET /bff/api/product/getall?categoryId=1
GET /bff/api/product/search?q=iphone
```

Search bar → `?search=` use karo (`getall` par).

---

## 8. Reviews (UPDATED fields)

```http
GET /bff/api/products/{productId}/reviews?PageNumber=1&PageSize=10
```

Response item mein ab ye fields hain:

```json
{
  "id": 1,
  "productId": 1,
  "userId": 2,
  "userName": "Ali Khan",
  "productName": "iPhone 15 Pro",
  "rating": 5,
  "comment": "Great!",
  "createdDate": "2026-06-25T..."
}
```

`"User #2"` mat dikhao — `userName` use karo.

---

## 9. Image Upload

```http
POST /bff/api/product/uploadimage
Authorization: Bearer <seller_or_admin_token>
Content-Type: multipart/form-data
```

Field: `file` (max 5MB)

Response:

```json
{ "url": "/uploads/abc123.jpg" }
```

Full image URL: `http://localhost:5241/uploads/abc123.jpg`

---

## 10. TypeScript Types (copy-paste)

```typescript
interface TokenResponse {
  token: string;
  expiresIn: number;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  email: string;
  otp: string;       // 4 digits — NOT "token"
  newPassword: string;
}

interface PagedRequest {
  pageNumber?: number;
  pageSize?: number;
}

interface PagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  data: T[];
}

interface RoleDto {
  id: number;
  name: string;
  isActive: boolean;
}

interface CartDto {
  id?: number;
  userId: number;
  userName?: string;
  items: CartItemDto[];
  totalAmount: number;
}

interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderDto {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdDate: string;
  items: OrderItemDto[];
}
```

---

## 11. Frontend Checklist (implement / verify)

```
□ .env.local: NEXT_PUBLIC_API_URL=/bff, BACKEND_API_URL=http://localhost:5241
□ Login: sirf token + expiresIn store karo (refreshToken hatao)
□ Forgot password page: email → success message
□ Reset password page: email + 4-digit OTP + new password
□ Role-based skip: cart/getmyorders sirf User; getall roles sirf Admin
□ Admin Roles: GET /bff/Role/GetAll (NOT /api/Role/...)
□ Orders URLs: getmyorders, getall, getsellerorders/seller
□ Paged lists: response.data use karo
□ Reviews: userName, productName display
□ Token expire → redirect /login
□ Admin users: Active → trash (deactivate); Inactive → activate icon
```

---

## 12. Common Errors & Fix

| Problem | Cause | Fix |
|---------|-------|-----|
| Roles page: "Could not load roles" + 500 | Backend mapper missing (fixed) | Backend restart; URL `/bff/Role/GetAll` |
| Admin login par cart/orders fail | User-only APIs call ho rahi thin | `skip: !isUser` lagao |
| OTP email nahi, console mein dikhe | Dev SMTP off tha | Backend `appsettings.Development.json` → `Smtp.Enabled: true` ya console se OTP copy |
| Reset: "Invalid or expired OTP" | Galat OTP ya 10 min expire | Naya OTP request karo |
| 401 Unauthorized | Token missing/expired | Login dubara |
| 403 Forbidden | Galat role | Endpoint + role table dekho (Section 4) |

---

## 13. Already Updated in Repo (pull / sync)

Frontend codebase mein ye changes ho chuke hain — verify karo same pattern follow ho:

| File | Change |
|------|--------|
| `features/cart/CartProvider.tsx` | Cart fetch `skip: !isUser` |
| `app/dashboard/page.tsx` | Orders fetch `skip: !isUser` |
| `app/dashboard/orders/page.tsx` | Orders fetch `skip: !isUser` |
| `app/admin/users/page.tsx` | Active/Inactive badge + deactivate/activate toggle |
| `lib/store/api/api.ts` | `activateAdminUser` mutation |

Backend:

| File | Change |
|------|--------|
| `Service/Common/Mapper/MappingProfile.cs` | `Role → RoleDto` mapping |
| `Controllers/OrderController.cs` | Explicit `getmyorders`, `getall` routes |
| `Program.cs` | Email, Review, FileStorage DI registered |
| `Controllers/AdminController.cs` | `DELETE` deactivate + `PUT .../activate` |
| `AdminService.cs` | Soft delete + `ActivateUserAsync` |

---

## 14. Related Docs

| File | Use |
|------|-----|
| `docs/Frontend-Changes-Handoff.md` | Full API reference |
| `docs/Phase2-Frontend-API-Guide.md` | Search, orders, reviews detail |
| `docs/Auth-Upload-Frontend-Guide.md` | Auth + upload focus |
| `docs/Dummy-Data-Seed.md` | Seed users & products |

---

---

## 15. UserDto — `roleName` / `roleId` (FIXED)

**Problem:** `GET /api/admin/users` aur `GET /api/user/profile` mein `roleName: null` aa raha tha — `User` → `UserDto` map karte waqt `Roles` table join nahi ho rahi thi.

**Fix (backend):** `UserDtoEnricher` ab in endpoints par `roleId` + `roleName` set karta hai (`Roles` table se lookup).

### Affected endpoints

```http
GET /bff/api/admin/users?PageNumber=1&PageSize=20
GET /bff/api/admin/users/{id}
PUT /bff/api/admin/users/{id}
GET /bff/api/user/profile
PUT /bff/api/user/profile
GET /bff/api/auth/users          (admin list — same UserDto shape)
```

### Expected response (ab)

```json
{
  "id": 2,
  "fullName": "Admin User",
  "email": "admin@edgecart.com",
  "roleId": 1,
  "roleName": "Admin",
  "isActive": true
}
```

### Role IDs (database)

| roleId | roleName |
|--------|----------|
| 1 | Admin |
| 2 | User |
| 3 | Seller |

**Frontend action:** `user.roleName` use karo routing/UI ke liye — default `"User"` fallback hata do jab `roleName` null ho.

### Admin user status — deactivate / activate (soft delete)

Admin users list mein har user ke paas `isActive` field hai. **Hard delete nahi hota.**

#### Deactivate (delete icon — Active users)

```http
DELETE /bff/api/admin/users/{id}
Authorization: Bearer <admin_token>
```

| Result | Detail |
|--------|--------|
| DB | Row rehti hai, `isActive: false` |
| Response | `204 No Content` |
| Login | User login nahi kar sakta — `"Account is deactivated."` |
| Self | Admin apna account deactivate nahi kar sakta — `400` |

#### Activate (check icon — Inactive users)

```http
PUT /bff/api/admin/users/{id}/activate
Authorization: Bearer <admin_token>
```

| Result | Detail |
|--------|--------|
| DB | `isActive: true` |
| Response | `204 No Content` |
| Login | User dubara login kar sakta hai |

#### UI behaviour (implemented)

| `isActive` | Badge | Action button |
|------------|-------|---------------|
| `true` | **Active** (green) | Trash icon → `DELETE` (deactivate) |
| `false` | **Inactive** (red) | UserCheck icon → `PUT .../activate` |

#### RTK Query (frontend)

```typescript
// Deactivate
useDeleteAdminUserMutation()  // DELETE /api/admin/users/{id}

// Activate
useActivateAdminUserMutation() // PUT /api/admin/users/{id}/activate
```

Dono mutations ke baad `invalidatesTags: ["Admin"]` — list auto-refresh.

#### Alternative (PUT update)

Activate/deactivate `PUT /api/admin/users/{id}` body mein `isActive: true/false` se bhi ho sakta hai, lekin dedicated endpoints prefer karo.

Hard delete nahi hota (orders/cart FK error avoid).

```typescript
interface UserDto {
  id: number;
  fullName: string;
  email: string;
  roleId: number;
  roleName: string;   // "Admin" | "User" | "Seller"
  isActive: boolean;
  image?: string | null;
}
```

---

## 16. Profile Image Upload (NEW)

Optional — Admin / User / Seller sab upload kar sakte hain (login ke baad).

```http
POST /bff/api/user/upload-profile-image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Form field: **`file`** | Max 5MB | JPG, PNG, WEBP, GIF

Response: updated profile with `image` URL.

**Full prompt for frontend:** `docs/Frontend-Profile-Image-Prompt.md`

---
