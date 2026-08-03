# EdgeCart — Latest Changes (Frontend Handoff)

> **Date:** 29 June 2026  
> **Backend:** `http://localhost:5241`  
> **Frontend:** `http://localhost:3000`  
> **Swagger:** `http://localhost:5241/swagger`

Yeh document **recent backend + frontend integration changes** ka summary hai.

---

## 1. Environment Setup

```env
BACKEND_API_URL=http://localhost:5241
NEXT_PUBLIC_API_URL=/bff
```

Browser se calls **`/bff/...`** par jati hain. Har protected request: `Authorization: Bearer <jwt_token>`.

---

## 2. Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@edgecart.com` | `Password123` |
| Customer (User) | `ali@edgecart.com` | `Password123` |
| Seller | `seller1@edgecart.com` | `Password123` |

---

## 3. Authentication

- Login: `{ token, expiresIn }` only — **no refreshToken**
- Forgot password: 4-digit OTP (10 min, max 5/day)
- Reset password: `{ email, otp, newPassword }`
- Deactivated account login → `"Account is deactivated."`

---

## 4. Role-Based API Rules

| Endpoint | Role |
|----------|------|
| `GET /api/cart/get` | User |
| `GET /api/orders/getmyorders` | User |
| `GET /api/orders/getall` | Admin |
| `GET /api/orders/getsellerorders/seller` | Seller |
| `GET /Role/GetAll` | Admin |

```typescript
import { useRoleApiSkip } from "@/lib/hooks/useRoleApiSkip";
const { skipUserApi, skipAdminApi, skipSellerApi } = useRoleApiSkip();
```

---

## 5. Frontend Checklist

```
✓ .env.local BFF proxy
✓ Login: token + expiresIn only
✓ Forgot / reset: 4-digit OTP
✓ Role-based skip (cart, orders, admin APIs)
✓ Admin Roles: GET /Role/GetAll
✓ Paged lists: response.data
✓ Reviews: userName display
✓ UserDto: roleId + roleName
✓ Admin users: Active → trash (deactivate); Inactive → activate icon
```

---

## 6. UserDto — roleId / roleName (FIXED)

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

| roleId | roleName |
|--------|----------|
| 1 | Admin |
| 2 | User |
| 3 | Seller |

**Frontend:** `lib/utils/role.ts` — `resolveUserRole()`, `resolveRoleId()`.

---

## 7. Admin User Deactivate / Activate (Soft Delete)

### Deactivate (Active users — trash icon)

```http
DELETE /bff/api/admin/users/{id}
```

- `isActive: false` — row DB mein rehti hai
- Response: `204 No Content`
- Self-deactivate: `400`
- Login blocked: `"Account is deactivated."`

### Activate (Inactive users — check icon)

```http
PUT /bff/api/admin/users/{id}/activate
```

- `isActive: true`
- Response: `204 No Content`

### RTK Query

```typescript
useDeleteAdminUserMutation()   // deactivate
useActivateAdminUserMutation() // activate
```

Both `invalidatesTags: ["Admin"]` — list auto-refresh.

### UI

| isActive | Badge | Button |
|----------|-------|--------|
| true | Active (green) | Trash → DELETE |
| false | Inactive (red) | UserCheck → PUT activate |

**Implemented in:** `app/admin/users/page.tsx`, `lib/store/api/api.ts`

---

## 8. Common Errors

| Problem | Fix |
|---------|-----|
| Roles page 500 | `/bff/Role/GetAll`; backend restart |
| Admin login par cart fail | `skip: skipUserApi` |
| All users show "User" role | Backend `UserDtoEnricher`; check `roleId` in API |
| Self-deactivate fails | Expected — admin apna account deactivate nahi kar sakta |
| Deactivated login | Show backend message on login page |

---

## 9. Updated Files (Frontend)

| File | Change |
|------|--------|
| `features/cart/CartProvider.tsx` | Cart `skip: skipUserApi` |
| `app/admin/users/page.tsx` | Role dropdown, activate/deactivate, error messages |
| `lib/store/api/api.ts` | `activateAdminUser` mutation |
| `lib/utils/role.ts` | `resolveUserRole`, `resolveRoleId` |
| `lib/utils/apiError.ts` | API error message helper |
| `lib/hooks/useRoleApiSkip.ts` | Role-based RTK skip flags |
