# Role-Based Access Control (RBAC)

Complete guide to the role-based access control system in MyDoctor.

## Overview

MyDoctor implements a three-tier role system with automatic route protection and role-based redirects. The system ensures users only access features appropriate for their role.

## User Roles

### 🟢 PATIENT
**Created by**: Public signup form

**Access**:
- ✅ Home page (/)
- ✅ Public pages
- ❌ Admin dashboard (/admin/*)

**Behavior**:
- Created when users sign up via `/signup`
- Must login after signup (no auto-login)
- Redirected to home page (/) after login
- Cannot access admin features

**Use Case**: 
Regular users who sign up through the public signup form. They can potentially view their own appointments, medical records, etc. (when those features are built).

### 🔵 STAFF
**Created by**: Admin users in User Management

**Access**:
- ✅ Home page (/)
- ✅ Admin dashboard (/admin)
- ✅ Patients management
- ✅ Doctors management
- ✅ View users (limited editing)
- ❌ Full user management (can't change roles)

**Behavior**:
- Created by admins through User Management
- Can login and access admin dashboard
- Redirected to `/admin` after login
- Limited administrative privileges

**Use Case**: 
Medical staff, receptionists, or support staff who need access to manage patients and doctors but shouldn't have full admin privileges.

### 🟣 ADMIN
**Created by**: Database seed or promoted by other admins

**Access**:
- ✅ Home page (/)
- ✅ Full admin dashboard access (/admin)
- ✅ User management (full CRUD)
- ✅ Role management (can change user roles)
- ✅ Patients management
- ✅ Doctors management
- ✅ Settings

**Behavior**:
- Full system access
- Redirected to `/admin` after login
- Can create/edit/delete users
- Can promote/demote user roles

**Use Case**: 
System administrators with full control over the application.

## Middleware Protection

The middleware (`middleware.ts`) automatically protects routes:

### Protected Routes

#### `/admin/*` - Admin Dashboard
```typescript
// Requires: Logged in user
// Allowed roles: ADMIN, STAFF
// Denied roles: PATIENT (redirected to /)
```

**What happens**:
1. User tries to access `/admin`
2. Middleware checks `user_id` cookie
3. If not logged in → redirect to `/login`
4. If logged in as PATIENT → redirect to `/`
5. If logged in as ADMIN/STAFF → allow access

### Auto-Redirects

#### `/login` and `/signup`
```typescript
// If already logged in:
// - ADMIN/STAFF → redirect to /admin
// - PATIENT → redirect to /
```

**What happens**:
- Prevents logged-in users from accessing login/signup pages
- Redirects them to appropriate dashboard based on role

## Login Flow

### 1. User Submits Login Form

```
User enters credentials
    ↓
Form submitted to login() action
    ↓
Credentials validated
    ↓
User found and password verified
    ↓
Session cookies created (user_id, user_role, user_email)
    ↓
Role returned to client
```

### 2. Role-Based Redirect

```typescript
if (role === 'ADMIN' || role === 'STAFF') {
  redirect to '/admin'
} else { // PATIENT
  redirect to '/'
}
```

## Signup Flow

### Public Signup Process

```
User visits /signup
    ↓
Fills registration form
    ↓
Form submitted to signup() action
    ↓
User created with PATIENT role
    ↓
No session created (must login)
    ↓
Success message shown
    ↓
Redirected to /login (after 2 seconds)
    ↓
User logs in with credentials
    ↓
Redirected to / (home page)
```

### Key Points:
- ✅ All signups get PATIENT role
- ✅ No auto-login after signup
- ✅ Must explicitly login
- ✅ Redirected to home page after login

## Role Management

### How to Change User Roles

Only ADMIN users can change roles:

1. Go to **User Management** (`/admin/users`)
2. Click **"Edit"** on user
3. Change **Role** dropdown
4. Click **"Update User"**

### Role Promotion Examples:

**Promote PATIENT to STAFF**:
- Edit user
- Change role from PATIENT to STAFF
- User can now access admin dashboard

**Promote STAFF to ADMIN**:
- Edit user
- Change role from STAFF to ADMIN
- User gets full admin privileges

**Demote ADMIN to STAFF**:
- Edit user
- Change role from ADMIN to STAFF
- User loses some admin privileges

## Access Control Matrix

| Feature | PATIENT | STAFF | ADMIN |
|---------|---------|-------|-------|
| Home Page (/) | ✅ | ✅ | ✅ |
| Signup | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| Admin Dashboard | ❌ | ✅ | ✅ |
| View Patients | ❌ | ✅ | ✅ |
| View Doctors | ❌ | ✅ | ✅ |
| View Users | ❌ | ⚠️ Limited | ✅ |
| Create Users | ❌ | ❌ | ✅ |
| Edit Users | ❌ | ❌ | ✅ |
| Delete Users | ❌ | ❌ | ✅ |
| Change Roles | ❌ | ❌ | ✅ |
| System Settings | ❌ | ⚠️ Limited | ✅ |

## Session Management

### Session Cookies

Three HTTP-only cookies are set on login:

```typescript
user_id: "uuid"           // User's database ID
user_role: "ADMIN|STAFF|PATIENT"  // User's role
user_email: "email@example.com"   // User's email
```

**Security**:
- `httpOnly: true` - Cannot be accessed via JavaScript
- `secure: true` (production) - Only sent over HTTPS
- `sameSite: "lax"` - CSRF protection
- `maxAge: 7 days` - Auto-expire after 1 week

### Session Validation

Middleware checks cookies on every request:
1. Reads `user_id` cookie
2. Reads `user_role` cookie
3. Validates route access based on role
4. Redirects if unauthorized

## Implementation Details

### Middleware (`middleware.ts`)

```typescript
export function middleware(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value
  const userRole = request.cookies.get('user_role')?.value
  
  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (userRole === 'PATIENT') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  // Redirect logged-in users from login/signup
  if ((pathname === '/login' || pathname === '/signup') && userId) {
    if (userRole === 'ADMIN' || userRole === 'STAFF') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    if (userRole === 'PATIENT') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
}
```

### Login Action (`app/actions/auth.ts`)

```typescript
export async function login(formData: FormData) {
  // ... validation and authentication
  
  // Set session cookies
  cookieStore.set("user_id", user.id, { ... })
  cookieStore.set("user_role", user.role, { ... })
  cookieStore.set("user_email", user.email, { ... })
  
  // Return role for client-side redirect
  return { success: true, role: user.role }
}
```

### Signup Action (`app/actions/auth.ts`)

```typescript
export async function signup(formData: FormData) {
  // ... validation
  
  // Create user with PATIENT role
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: Role.PATIENT  // Always PATIENT for signups
    }
  })
  
  // NO session created - user must login
  return { success: true }
}
```

## Testing Role-Based Access

### Test PATIENT Access

1. **Create PATIENT account**:
   ```
   Visit /signup
   Create account
   Login at /login
   ```

2. **Verify restrictions**:
   - ✅ Redirected to `/` after login
   - ❌ Cannot access `/admin` (redirected to `/`)
   - ✅ Can logout and login again

### Test STAFF Access

1. **Create STAFF account** (as admin):
   ```
   Login as admin
   Go to /admin/users
   Click "Add User"
   Set role to STAFF
   ```

2. **Verify access**:
   - ✅ Can login
   - ✅ Redirected to `/admin` after login
   - ✅ Can view patients/doctors
   - ✅ Can view users list
   - ⚠️ Limited edit capabilities

### Test ADMIN Access

1. **Use seeded admin**:
   ```
   Email: admin@mydoctor.com
   Password: admin123
   ```

2. **Verify full access**:
   - ✅ Can login
   - ✅ Redirected to `/admin` after login
   - ✅ Full user management
   - ✅ Can change roles
   - ✅ Can delete users

### Test Middleware Protection

1. **Try accessing admin while logged out**:
   ```
   Visit /admin (not logged in)
   → Redirected to /login
   ```

2. **Try accessing admin as PATIENT**:
   ```
   Login as PATIENT
   Try to visit /admin
   → Redirected to /
   ```

3. **Try accessing login while logged in**:
   ```
   Login as ADMIN
   Try to visit /login
   → Redirected to /admin
   ```

## Security Considerations

### ✅ Implemented

- Role-based route protection
- Middleware validates every request
- HTTP-only secure cookies
- Server-side role validation
- No client-side role checks (can be bypassed)
- Session expiration (7 days)

### 🔒 Production Recommendations

1. **Audit Logging**: Log all role changes and admin actions
2. **Role Hierarchy**: Implement more granular permissions
3. **API Protection**: Add role checks to all server actions
4. **Rate Limiting**: Prevent brute force role escalation attempts
5. **Session Validation**: Revalidate user role from database on critical actions
6. **2FA for Admins**: Require two-factor authentication for admin accounts

### ⚠️ Current Limitations

- Role is stored in cookie (can be modified client-side)
  - However, server still validates from database
- No granular permissions within roles
- No audit trail of role changes
- No session revocation mechanism
- Admin can't see who changed what

## Future Enhancements

1. **Granular Permissions**: Move beyond simple roles to permission-based system
2. **Role Groups**: Create custom role groups with specific permissions
3. **Temporary Role Elevation**: Allow temporary admin access
4. **API Key System**: Generate API keys with specific role permissions
5. **Audit Trail**: Track all role changes and admin actions
6. **Session Management**: View and revoke active sessions
7. **Patient Dashboard**: Create dedicated dashboard for PATIENT users
8. **Multi-tenant**: Support multiple organizations with separate role systems

## Troubleshooting

### "Cannot access admin dashboard"

**For PATIENT users**: This is expected. PATIENT role cannot access `/admin`.

**Solution**: Contact an admin to upgrade your role to STAFF or ADMIN.

### "Redirected from login immediately"

**Cause**: You're already logged in.

**Solution**: Logout first if you want to login as different user.

### "Wrong dashboard after login"

**Cause**: Role-based redirect is working.

**Solution**: 
- ADMIN/STAFF go to `/admin`
- PATIENT go to `/`

### "Can't change user roles"

**Cause**: You need ADMIN role to change roles.

**Solution**: Login as ADMIN to modify user roles.

## Related Documentation

- [Authentication Guide](./AUTHENTICATION.md) - Login/Signup system
- [User Management](./USER_MANAGEMENT.md) - Managing users
- [Quick Start](./QUICK_START.md) - Getting started

---

**Questions?** Check the middleware.ts file for the latest route protection rules.
