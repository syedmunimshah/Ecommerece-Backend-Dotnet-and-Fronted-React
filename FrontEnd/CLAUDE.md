# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is the **frontend** for a role-based ecommerce platform. The backend (.NET 8 ASP.NET Core) lives at `d:\Dotnet\RoleBased ECommerce Platform\ECommerce\`. The frontend is not yet implemented — this directory is the workspace where it will be built.

## Backend API

The backend runs at:
- HTTP: `http://localhost:5241`
- HTTPS: `https://localhost:7109`
- Swagger UI: `http://localhost:5241/swagger`

### Authentication

JWT-based auth. After login, include the token as `Authorization: Bearer <token>` on all protected requests. Tokens expire after 2 hours.

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/register` | POST | None | Register (role defaults to User) |
| `/api/auth/login` | POST | None | Returns JWT token |
| `/api/auth/users` | GET | Admin | Paginated user list |

### Roles

Three roles are enforced server-side:
- **Admin** — full system access
- **User** — shopping, cart, orders, reviews
- **Seller** — product management, order fulfillment, requires seller profile approval

### Key API Endpoints

**Products**
- `GET /api/product/getall` — paginated list (public)
- `GET /api/product/getbyid/{id}` — product detail
- `POST /api/product/create` — Seller only
- `PUT /api/product/update/{id}` — Seller only
- `DELETE /api/product/delete/{id}` — Seller only

**Cart** (User role)
- `POST /api/cart/add`
- `GET /api/cart/get`
- `PUT /api/cart/update`
- `DELETE /api/cart/remove`

**Orders**
- `POST /api/orders/create` — creates order from cart (User)
- `GET /api/orders/getmyorders` — User's orders
- `GET /api/orders/getsellerorders` — Seller's orders
- `GET /api/orders/getall` — Admin only

**Other**
- `/api/category/*` — category CRUD
- `/api/review/*` — product reviews
- `/api/sellerprofiles/*` — seller registration/approval (Pending → Approved/Rejected by Admin)
- `/api/ordertracking/*` — order status updates

### Pagination

All list endpoints accept `PageNumber` (default 1) and `PageSize` (default 10) query params. Responses return `{ pageNumber, pageSize, totalRecords, data[] }`.

## Data Model Highlights

- **SellerProfile** has a status workflow: `Pending (0) → Approved (1) / Rejected (2)`. Sellers cannot manage products until approved.
- **Cart** is created automatically on user registration (one per user).
- **Order** is created from the current cart contents; cart is then cleared.
- Prices use `decimal(18,2)`.
- Most entities have `IsActive` (soft delete) and audit fields (`CreatedDate`, `CreatedBy`, `UpdateDate`, `UpdateBy`).

## Backend Project Structure (for reference)

```
ECommerce/
├── ECommerce/        # ASP.NET Core API — controllers, Program.cs, appsettings.json
├── Service/          # Business logic — DTOs, interfaces, AutoMapper profiles
└── Repository/       # EF Core entities, generic repository, AppDbContext
```

The role enum values (Admin=1, User=2, Seller=3) are used in JWT claims as `ClaimTypes.Role`.
