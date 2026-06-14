# EdgeCart — Next.js Frontend

Next.js 15 (App Router) frontend for the Role-Based ECommerce Platform.

## Quick start

### 1. Install dependencies
```powershell
cd "d:\Dotnet\RoleBased ECommerce Platform\FrontEnd"
npm install
```

### 2. Set up environment
```powershell
copy .env.local.example .env.local
```
Open `.env.local` and verify:
```
BACKEND_API_URL=http://localhost:5241
JWT_SECRET=YourLongSecureSecretKeyHere1234567890   # must match appsettings.json jwt.Key
AUTH_COOKIE_NAME=auth_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Enable CORS on the backend

Add this to `ECommerce/ECommerce/Program.cs` **before** `app.UseAuthentication()`:

```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("Frontend", policy => policy
        .WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// ... later, after app.Build():
app.UseCors("Frontend");
```

### 4. Start both servers

Backend (in `d:\Dotnet\RoleBased ECommerce Platform\ECommerce\`):
```powershell
dotnet run --project ECommerce/ECommerce
```

Frontend:
```powershell
npm run dev
```

Visit **http://localhost:3000**.

## Key routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Home / featured products |
| `/products` | Public | Product listing with filters |
| `/products/[id]` | Public | Product detail + reviews |
| `/login` | Public | Sign in |
| `/register` | Public | Create account |
| `/cart` | Authenticated | Cart page |
| `/checkout` | User | Place order |
| `/dashboard` | Authenticated | Profile |
| `/dashboard/orders` | Authenticated | My orders + tracking |
| `/dashboard/become-seller` | Authenticated | Seller application |
| `/admin` | Admin only | Admin overview |
| `/admin/users` | Admin only | User management |
| `/admin/sellers` | Admin only | Approve / reject sellers |
| `/admin/orders` | Admin only | All orders |
| `/admin/categories` | Admin only | Category CRUD |

## Architecture notes

- All API calls from the browser flow through `/api/bff/*` route handlers that attach the JWT from the HTTP-only cookie.
- Server Components read the cookie directly via `getServerToken()`.
- Middleware at `middleware.ts` enforces role-based access before any page renders.
- Redux Toolkit holds `auth.user` (derived from JWT) and UI state (toasts, cart drawer).
- React Query manages all server data with a 30s stale time.
