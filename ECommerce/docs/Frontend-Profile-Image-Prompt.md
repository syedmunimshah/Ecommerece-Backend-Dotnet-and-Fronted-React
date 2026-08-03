# EdgeCart — Profile Image Upload (Frontend Prompt)

> Backend ready. **Admin, Seller, User** — sab logged-in users apni profile image upload kar sakte hain (optional).

---

## Summary

| Item | Detail |
|------|--------|
| DB column | `Users.Imgae` (typo in DB — backend maps to JSON `image`) |
| Default | `image: null` — placeholder avatar dikhao |
| Kab upload | Login ke baad dashboard / profile settings se |
| Role | Koi bhi authenticated role (Admin / User / Seller) |
| Max size | 5 MB |
| Formats | JPG, JPEG, PNG, WEBP, GIF |

---

## APIs

### 1. Get profile (image included)

```http
GET /bff/api/user/profile
Authorization: Bearer <token>
```

**Response `200`:**

```json
{
  "id": 2,
  "fullName": "Admin User",
  "email": "admin@edgecart.com",
  "roleId": 1,
  "roleName": "Admin",
  "isActive": true,
  "image": "http://localhost:5241/uploads/profiles/abc123.jpg",
  "createdDate": "2026-01-01T00:00:00Z"
}
```

`image` **null** ho to default avatar use karo.

---

### 2. Upload profile image (NEW)

> **Important:** Upload **direct** backend par jati hai — `/bff` proxy par nahi (bari files fail ho sakti thin).

```http
POST http://localhost:5241/api/user/upload-profile-image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Frontend env:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5241
```

RTK mutation `fetch()` se seedha `5241` par call karti hai. CORS backend par `localhost:3000` ke liye allowed hai.

**Form field:** `file` (single image file)

**Response `200`:** Updated full user profile (same shape as GET profile) — `image` URL set ho jayegi.

```json
{
  "id": 3,
  "fullName": "Ali Khan",
  "email": "ali@edgecart.com",
  "roleId": 2,
  "roleName": "User",
  "isActive": true,
  "image": "http://localhost:5241/uploads/profiles/f1a2b3c4.jpg"
}
```

**Errors:**

| Status | Message |
|--------|---------|
| `400` | `"Image file is required."` |
| `400` | File too large / invalid format |
| `401` | Not logged in |

---

### 3. Update profile (name/password — image alag endpoint)

```http
PUT /bff/api/user/update-profile
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "fullName": "Ali Khan",
  "newPassword": "OptionalNewPass123"
}
```

Image yahan se update **nahi** hoti — sirf `upload-profile-image` use karo.

---

### 4. Admin users list (image per user)

```http
GET /bff/api/admin/users?PageNumber=1&PageSize=20
Authorization: Bearer <admin_token>
```

Har user object mein `image` field (null ya URL).

---

## TypeScript

```typescript
interface UserDto {
  id: number;
  fullName: string;
  email: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
  image: string | null;  // was "imgae" — ab "image" use karo
  createdDate?: string;
}

// RTK Query example
uploadProfileImage: builder.mutation<UserDto, FormData>({
  query: (body) => ({
    url: "/api/user/upload-profile-image",
    method: "POST",
    body,
  }),
  invalidatesTags: ["User"],
}),
```

**Usage:**

```typescript
const formData = new FormData();
formData.append("file", selectedFile);

const updated = await uploadProfileImage(formData).unwrap();
// updated.image = new URL
```

---

## UI Requirements

1. **Dashboard / Profile page** — logged-in user ke liye:
   - Avatar circle (default jab `image` null)
   - "Change photo" button → file picker
   - Upload par loading spinner
   - Success par avatar refresh (`GET profile` ya mutation response)

2. **Header / UserMenu** — `user.image` se avatar dikhao  
   - Purana field `imgae` hata kar `image` use karo

3. **Next.js Image** — `next.config.ts` mein remote pattern add karo:

```typescript
{
  protocol: "http",
  hostname: "localhost",
  port: "5241",
  pathname: "/uploads/profiles/**",
}
```

4. **Optional** — Admin users table mein chota avatar column (`user.image`)

---

## Flow

```
Login → Dashboard → Profile
  → User picks image
  → POST /api/user/upload-profile-image (multipart file)
  → Backend saves file → Users.Imgae column
  → Response image URL
  → UI avatar update
```

---

## Notes

- Image upload **optional** — register/login par required nahi
- Har user sirf **apni** image upload kar sakta hai (token se userId)
- Product image upload alag hai: `POST /api/product/uploadimage` (Seller only)
- Profile image: `POST /api/user/upload-profile-image` (sab roles)

---

## Troubleshooting upload

| Error message | Fix |
|---------------|-----|
| `Could not reach the server...` | Backend start karo — Swagger: `http://localhost:5241/swagger` |
| `File is too large...` | 5 MB se choti file (aapki 2.31 MB OK hai) |
| `Invalid image content type` | Backend ab `image/jpg` + empty content-type (extension se) accept karta hai — backend restart |
| Generic / network fail via `/bff` | `.env.local` mein `NEXT_PUBLIC_BACKEND_URL=http://localhost:5241` — upload direct backend par |

**Steps after backend update:**

1. `.env.local`: `NEXT_PUBLIC_BACKEND_URL=http://localhost:5241`
2. Backend restart (LocalFileStorageService update)
3. Frontend restart (`npm run dev`)
4. Settings → Change photo → JPG try karo

---

## Checklist

```
□ UserDto type: imgae → image
□ UserMenu avatar: user.image
□ Profile page: file input + upload mutation
□ invalidatesTags: ["User"] after upload
□ next.config remotePatterns: /uploads/profiles/**
□ Null image → default placeholder
□ Max 5MB client-side hint (optional)
```

---

**Backend URL:** `http://localhost:5241`  
**BFF:** `NEXT_PUBLIC_API_URL=/bff`
