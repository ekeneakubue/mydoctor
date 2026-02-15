# User Management Guide

Complete guide for managing users in the CityCare admin dashboard.

## Overview

The User Management system allows administrators to create, edit, and delete user accounts. All users have either ADMIN or STAFF roles with secure password storage.

## Features

### ✅ Create Users
- Add new users with full details
- Upload user avatar images
- Set role (ADMIN/STAFF)
- Automatic password hashing
- Email uniqueness validation

### ✅ Edit Users
- Update user information
- Change user roles
- Update or change password
- Upload/change avatar
- Email validation (prevents duplicates)

### ✅ Delete Users
- Delete user accounts
- Confirmation dialog before deletion
- Cannot be undone

### ✅ Search & Filter
- Search by name or email
- Filter by role (All/Admin/Staff)
- Real-time filtering

## Accessing User Management

1. Login to the admin dashboard
2. Navigate to **Users** in the sidebar
3. Or visit: http://localhost:3000/admin/users

## Creating a New User

### Step-by-Step:

1. Click the **"Add User"** button (top right)
2. Fill in the user details:
   - **Full Name** - User's full name (required)
   - **Email** - Must be unique (required)
   - **Phone** - Optional contact number
   - **Password** - Min 6 characters (required)
   - **Role** - Select ADMIN or STAFF
3. Optionally upload an avatar image:
   - Click the upload icon on the avatar circle
   - Select an image file (JPG, PNG, etc.)
   - Preview appears instantly
   - Can remove and change before saving
4. Click **"Create User"**
5. User list refreshes automatically

### Validation Rules:

- ✅ Name is required
- ✅ Email must be valid format
- ✅ Email must be unique
- ✅ Password minimum 6 characters
- ✅ Role must be selected
- ✅ Image upload is optional

### What Happens:

1. Form data is validated
2. Email uniqueness is checked
3. Password is hashed with bcrypt
4. User is created in database
5. Page refreshes with new user

## Editing a User

### Step-by-Step:

1. Find the user in the table
2. Click the **"Edit"** button in the Actions column
3. Edit modal opens with current user data
4. Modify any fields you want to change:
   - Name, email, phone, role
   - Password (leave blank to keep current)
   - Avatar (upload new or keep current)
5. Click **"Update User"**
6. User list refreshes with updated data

### Edit Features:

- ✅ All fields are pre-filled with current data
- ✅ Password field is optional (blank = no change)
- ✅ Email validation prevents duplicates
- ✅ Current avatar is shown
- ✅ Can upload new avatar or keep current
- ✅ Can change user role (ADMIN ↔ STAFF)

### Password Update:

- Leave password field **empty** to keep current password
- Enter new password (min 6 chars) to change it
- New password is hashed before saving
- User's current password is never shown

## Deleting a User

### Step-by-Step:

1. Find the user in the table
2. Click the **"Delete"** button in the Actions column
3. Confirmation dialog appears with:
   - User's name/email
   - Warning that action cannot be undone
4. Click **"Delete User"** to confirm
   - Or **"Cancel"** to abort
5. User is permanently removed
6. User list refreshes automatically

### Important Notes:

- ⚠️ **Deletion is permanent** - Cannot be undone
- ⚠️ All user data is removed from database
- ⚠️ Consider deactivating instead of deleting
- 💡 Tip: You might want to add a "deactivate" feature instead

## Search & Filter

### Search Users:

- Type in the search box at the top
- Searches both **name** and **email**
- Results filter in real-time
- Case-insensitive search

### Filter by Role:

- Use the role dropdown to filter
- Options: All Roles, Admin, Staff
- Combines with search filter
- Shows count of filtered results

### Example Searches:

- "john" - Finds John Smith, john@email.com
- "@citycare" - Finds all citycare.com emails
- Filter: "Admin" - Shows only admin users

## User Table Columns

| Column | Description |
|--------|-------------|
| **User** | Avatar and full name |
| **Email** | User's email address |
| **Role** | Badge showing ADMIN or STAFF |
| **Status** | Currently always "Active" |
| **Last Active** | Last update timestamp |
| **Actions** | Edit and Delete buttons |

## Roles Explained

### ADMIN Role
- Full system access
- Can manage all users (create, edit, delete)
- Can change user roles
- Access to all admin features

### STAFF Role
- Default role for new signups
- Access to admin dashboard
- Can view/manage patients and doctors
- Limited user management permissions

## API Reference

### Server Actions

All user management actions are in `app/actions/user-actions.ts`:

#### `updateUser(userId: string, formData: FormData)`

Updates an existing user's information.

**Parameters**:
- `userId`: User's UUID
- `formData`: Form data containing:
  - `name`: User's full name
  - `email`: Email address
  - `phone`: Phone number (optional)
  - `password`: New password (optional)
  - `role`: User role (ADMIN/STAFF)
  - `image`: Avatar file (optional)

**Returns**:
```typescript
{
  success: boolean;
  error?: string;
}
```

#### `deleteUser(userId: string)`

Permanently deletes a user from the database.

**Parameters**:
- `userId`: User's UUID to delete

**Returns**:
```typescript
{
  success: boolean;
  error?: string;
}
```

#### `getUser(userId: string)`

Retrieves a single user's data.

**Parameters**:
- `userId`: User's UUID

**Returns**:
```typescript
{
  success: boolean;
  user?: User;
  error?: string;
}
```

## Components

### `<UsersClient />`
**Location**: `components/admin/users-client.tsx`

Main user management component with:
- User table display
- Search and filter functionality
- Modal state management
- Edit and delete handlers

### `<CreateUserModal />`
**Location**: `components/admin/create-user-modal.tsx`

Modal for creating new users with:
- Form inputs for user data
- Avatar upload with preview
- Password visibility toggle
- Validation and error handling

### `<EditUserModal />`
**Location**: `components/admin/edit-user-modal.tsx`

Modal for editing existing users with:
- Pre-filled form fields
- Optional password update
- Avatar management
- Validation and error handling

## Security Features

### Password Security
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ Never displayed in UI or API responses
- ✅ Minimum length requirement (6 characters)
- ✅ Optional update (keep current if blank)

### Email Validation
- ✅ Format validation
- ✅ Uniqueness check on create
- ✅ Uniqueness check on update (excluding self)
- ✅ Server-side validation with Zod

### File Upload Security
- ✅ Files stored in `/public/uploads/avatars/`
- ✅ Filename sanitization
- ✅ Timestamp prefix prevents conflicts
- ✅ Graceful error handling

### Access Control
- ✅ Admin routes protected by middleware
- ✅ Must be logged in to access
- ✅ Server actions use Prisma (SQL injection protected)

## Common Use Cases

### 1. Create Admin User

```
1. Click "Add User"
2. Enter:
   - Name: Admin User
   - Email: admin2@citycare.com
   - Password: securepass123
   - Role: ADMIN
3. Click "Create User"
```

### 2. Promote User to Admin

```
1. Find user in table
2. Click "Edit"
3. Change Role from STAFF to ADMIN
4. Click "Update User"
```

### 3. Reset User Password

```
1. Find user in table
2. Click "Edit"
3. Enter new password in password field
4. Click "Update User"
```

### 4. Update User Info

```
1. Find user in table
2. Click "Edit"
3. Update name, email, or phone
4. Leave password blank (keep current)
5. Click "Update User"
```

### 5. Remove User

```
1. Find user in table
2. Click "Delete"
3. Confirm in dialog
4. User is removed permanently
```

## Troubleshooting

### "Email already in use"

**Problem**: Trying to create/update with existing email

**Solution**: 
- Use a different email address
- Check if user already exists in the system

### "Failed to update user"

**Problem**: Database or network error

**Solution**:
- Check database connection
- Verify user still exists
- Check browser console for errors
- Try again

### "Failed to delete user"

**Problem**: Database constraint or error

**Solution**:
- Check if user has related records
- Verify database connection
- Check server logs for details

### Modal doesn't close after save

**Problem**: Page not refreshing

**Solution**:
- Manually refresh the page
- Check browser console for errors
- Verify network connection

### Avatar upload fails

**Problem**: File upload error

**Solution**:
- Check file size (should be reasonable)
- Verify file is an image
- Check `/public/uploads/avatars/` directory exists
- User is still created, just without image

## Best Practices

### ✅ DO:
- Use strong passwords (min 6, but longer is better)
- Verify email addresses before creating users
- Use descriptive names for users
- Delete test users when done
- Keep admin users to minimum necessary

### ❌ DON'T:
- Don't reuse passwords across users
- Don't delete users with important data
- Don't share admin credentials
- Don't create unnecessary admin accounts
- Don't use weak passwords like "123456"

## Future Enhancements

Potential improvements:

1. **Bulk Operations**: Select multiple users for bulk delete/edit
2. **Deactivate Users**: Soft delete instead of permanent deletion
3. **Password Strength**: Enforce stronger password requirements
4. **Activity Log**: Track user actions and login history
5. **Email Verification**: Require email verification for new users
6. **Two-Factor Auth**: Add 2FA for admin accounts
7. **User Import**: Import users from CSV
8. **User Export**: Export user list to Excel/CSV
9. **Advanced Permissions**: Granular role permissions
10. **User Groups**: Organize users into groups/departments

## Related Documentation

- [Authentication Guide](./AUTHENTICATION.md) - Login/Signup system
- [Database Setup](./DATABASE_SETUP.md) - Database configuration
- [Quick Start](./QUICK_START.md) - Getting started guide

---

**Need Help?**

Check the browser console (F12) for error messages or review the server logs for detailed information.
