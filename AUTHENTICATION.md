# Authentication Guide

## Overview

CityCare uses a cookie-based authentication system with bcrypt password hashing. The authentication is built with Next.js Server Actions and protects admin routes with middleware.

## Features

- **Secure Authentication**: Passwords are hashed using bcryptjs (10 salt rounds)
- **Cookie-based Sessions**: HTTP-only cookies for security
- **Protected Routes**: Middleware protects `/admin` routes
- **Role-based Access**: Users can be ADMIN or STAFF
- **Auto-redirect**: Logged-in users redirected from login/signup pages

## How It Works

### 1. User Signup

**Route**: `/signup`

When a user signs up:
1. Form data is validated using Zod schemas
2. Password and confirm password are checked for match
3. Email uniqueness is verified
4. Password is hashed with bcrypt
5. User is created with STAFF role by default
6. Session cookies are set
7. User is redirected to `/admin`

**Default Role**: All new users get `STAFF` role. Admins must be created via seed script or manually.

### 2. User Login

**Route**: `/login`

When a user logs in:
1. Form data is validated
2. User is found by email
3. Password is verified with bcrypt
4. Session cookies are set on success
5. User is redirected to `/admin`

**Demo Admin Credentials**:
- Email: `admin@citycare.com`
- Password: `admin123`

### 3. Session Management

Three HTTP-only cookies are set on successful authentication:
- `user_id`: User's database ID (UUID)
- `user_role`: User's role (ADMIN or STAFF)
- `user_email`: User's email address

**Cookie Settings**:
- `httpOnly: true` - Cannot be accessed via JavaScript
- `secure: true` (production only) - Only sent over HTTPS
- `sameSite: "lax"` - CSRF protection
- `maxAge: 7 days` - Session expires after 7 days

### 4. Protected Routes

**Middleware** (`middleware.ts`) protects routes:
- `/admin/*` routes require authentication
- Unauthenticated users are redirected to `/login`
- Authenticated users accessing `/login` or `/signup` are redirected to `/admin`

### 5. Logout

**Function**: `logout()`

When a user logs out:
1. All session cookies are deleted
2. User is redirected to `/login`

**How to logout**:
- Click the "Logout" button in the admin sidebar

## API Reference

### Server Actions

All authentication actions are in `app/actions/auth.ts`:

#### `login(formData: FormData)`

Authenticates a user and creates a session.

**Parameters**:
- `email`: User's email address
- `password`: User's password

**Returns**:
```typescript
{
  success: boolean;
  error?: string;
}
```

#### `signup(formData: FormData)`

Creates a new user account and session.

**Parameters**:
- `name`: User's full name
- `email`: User's email address
- `password`: Password (min 6 characters)
- `confirmPassword`: Password confirmation

**Returns**:
```typescript
{
  success: boolean;
  error?: string;
}
```

#### `logout()`

Logs out the current user and redirects to login page.

**Returns**: Redirects to `/login`

#### `getCurrentUser()`

Gets the currently authenticated user's data.

**Returns**:
```typescript
{
  id: string;
  email: string;
  name: string | null;
  role: Role;
  phone: string | null;
  image: string | null;
} | null
```

## Usage Examples

### Login Form

```tsx
"use client"

import { login } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "An error occurred");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign in</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### Get Current User

```tsx
import { getCurrentUser } from "@/app/actions/auth";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return <p>Not logged in</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

### Logout Button

```tsx
"use client"

import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <button onClick={() => logout()}>
      Logout
    </button>
  );
}
```

## Security Considerations

### ✅ Implemented

- Password hashing with bcrypt (10 rounds)
- HTTP-only cookies (JavaScript cannot access)
- CSRF protection with SameSite cookies
- Secure cookies in production (HTTPS only)
- Server-side validation with Zod
- SQL injection protection via Prisma ORM
- Unique email constraint in database

### 🔒 Production Recommendations

1. **HTTPS Only**: Always use HTTPS in production
2. **Rate Limiting**: Add rate limiting to prevent brute force attacks
3. **Email Verification**: Implement email verification for new accounts
4. **Password Reset**: Add secure password reset functionality
5. **Two-Factor Auth**: Consider adding 2FA for admin accounts
6. **Session Management**: Implement session expiry and refresh tokens
7. **Audit Logging**: Log all authentication events
8. **Environment Variables**: Use strong secrets and secure storage

### ⚠️ Known Limitations

- No email verification required
- No password reset functionality
- No rate limiting on login attempts
- Sessions don't expire until cookie maxAge
- No refresh token mechanism
- No 2FA/MFA support

## Testing

### Test with Demo Admin

1. Start the development server:
```bash
npm run dev
```

2. Navigate to http://localhost:3000/login

3. Use demo credentials:
   - Email: `admin@citycare.com`
   - Password: `admin123`

4. You should be redirected to `/admin` dashboard

### Create New Test User

1. Navigate to http://localhost:3000/signup

2. Fill in the form:
   - Name: Your Name
   - Email: test@example.com
   - Password: test123 (min 6 chars)
   - Confirm Password: test123

3. Click "Create account"

4. You'll be logged in and redirected to `/admin`

### Test Protected Routes

1. In an incognito/private window, visit http://localhost:3000/admin

2. You should be redirected to `/login`

3. After logging in, visit `/login` again

4. You should be redirected to `/admin`

## Troubleshooting

### "Invalid email or password"

- Check that the user exists in the database
- Verify the password is correct
- Run `npm run prisma:studio` to check user data

### "An account with this email already exists"

- The email is already registered
- Use a different email or login instead

### Redirected to login when accessing /admin

- Your session has expired (7 days)
- Clear cookies and log in again
- Check that cookies are being set (browser dev tools)

### Middleware not working

- Make sure `middleware.ts` is in the root directory (not in `app/`)
- Check that the file is named exactly `middleware.ts`
- Restart the development server

### User not found after signup

- Check database connection
- Run `npm run prisma:studio` to verify user was created
- Check console for errors

## Database Schema

### User Model

```prisma
model User {
  id           String   @id @default(uuid()) @db.Uuid
  email        String   @unique
  name         String?
  passwordHash String
  phone        String?
  image        String?
  role         Role     @default(STAFF)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("users")
}

enum Role {
  STAFF
  ADMIN
}
```

## Future Enhancements

Potential improvements for the authentication system:

1. **JWT Tokens**: Move to stateless JWT-based auth
2. **OAuth**: Add Google/GitHub social login
3. **Magic Links**: Passwordless email authentication
4. **Session Store**: Use Redis for session management
5. **Password Strength**: Enforce stronger password policies
6. **Account Lockout**: Lock accounts after failed login attempts
7. **Activity Log**: Track user login/logout events
8. **Remember Me**: Extended session duration option
9. **Multi-device**: Support multiple active sessions
10. **RBAC**: More granular role-based permissions

## Support

For issues or questions:
1. Check the error messages in the browser console
2. Review server logs for authentication errors
3. Verify database schema matches Prisma schema
4. Ensure environment variables are set correctly
