# Testing User Management Features

Quick guide to test the newly implemented Edit and Delete functionality.

## What Was Fixed

Previously, the Edit and Delete buttons in `/admin/users` were non-functional. Now they are fully working with:

✅ **Edit User** - Update user details, password, role, and avatar
✅ **Delete User** - Remove users with confirmation dialog
✅ **Auto-refresh** - Page updates automatically after changes
✅ **Validation** - Proper error handling and validation
✅ **Server Actions** - New backend functions for update/delete

## Testing Edit User

### Test 1: Edit User Name

1. Visit http://localhost:3000/admin/users
2. Find any user in the table
3. Click **"Edit"** button
4. Change the user's name
5. Click **"Update User"**
6. ✅ Modal closes
7. ✅ Table updates with new name
8. ✅ Change persists on page refresh

### Test 2: Change User Role

1. Click **"Edit"** on a STAFF user
2. Change Role dropdown from STAFF to ADMIN
3. Click **"Update User"**
4. ✅ Role badge updates to purple "ADMIN"
5. ✅ Change is saved to database

### Test 3: Update Password

1. Click **"Edit"** on any user
2. Enter a new password (min 6 characters)
3. Leave other fields unchanged
4. Click **"Update User"**
5. ✅ Password is updated (hashed in database)
6. ✅ Can login with new password

### Test 4: Password Optional

1. Click **"Edit"** on any user
2. Change name or email
3. Leave password field **empty**
4. Click **"Update User"**
5. ✅ User updates successfully
6. ✅ Password remains unchanged
7. ✅ Can still login with old password

### Test 5: Update Avatar

1. Click **"Edit"** on any user
2. Click the upload icon on avatar
3. Select a new image file
4. Preview appears immediately
5. Click **"Update User"**
6. ✅ New avatar shows in table
7. ✅ Avatar also appears in sidebar (if it's your account)

### Test 6: Email Validation

1. Click **"Edit"** on User A
2. Try to change email to User B's email
3. Click **"Update User"**
4. ✅ Error message: "Email already in use by another user"
5. ✅ User is not updated
6. ✅ Modal stays open to fix error

## Testing Delete User

### Test 1: Delete Confirmation

1. Click **"Delete"** on any user
2. ✅ Confirmation modal appears
3. ✅ Shows user's name
4. ✅ Warning about permanent deletion
5. Click **"Cancel"**
6. ✅ Modal closes
7. ✅ User is NOT deleted

### Test 2: Delete User

1. Click **"Delete"** on a test user
2. Confirmation modal appears
3. Click **"Delete User"**
4. ✅ "Deleting..." loading state appears
5. ✅ User is removed from table
6. ✅ Page auto-refreshes
7. ✅ User is gone from database
8. Refresh page
9. ✅ User still deleted (permanent)

### Test 3: Delete Multiple Users

1. Delete User 1 - Works ✅
2. Delete User 2 - Works ✅
3. Delete User 3 - Works ✅
4. ✅ All deletions are permanent
5. ✅ Table updates each time

## Testing Search & Filter

### Test 1: Search Functionality

1. Type "admin" in search box
2. ✅ Table filters to show only matching users
3. Clear search
4. ✅ All users appear again

### Test 2: Role Filter

1. Select "Admin" from role dropdown
2. ✅ Only ADMIN users shown
3. Select "Staff" from role dropdown
4. ✅ Only STAFF users shown
5. Select "All Roles"
6. ✅ All users shown

### Test 3: Combined Search + Filter

1. Select "Staff" role filter
2. Type user name in search
3. ✅ Shows only STAFF users matching search
4. ✅ Results count updates correctly

## Testing Create User (Bonus)

Verify create still works after changes:

1. Click **"Add User"**
2. Fill in all fields:
   - Name: Test User
   - Email: test@test.com
   - Phone: +1234567890
   - Password: test123
   - Role: STAFF
3. Upload an avatar (optional)
4. Click **"Create User"**
5. ✅ Modal closes
6. ✅ New user appears in table
7. ✅ Page auto-refreshed

## Edge Cases to Test

### Test 1: Edit Your Own Account

1. Find the user you're logged in as
2. Click **"Edit"**
3. Change your name
4. Click **"Update User"**
5. ✅ Updates successfully
6. ✅ Sidebar shows new name
7. ✅ Still logged in

### Test 2: Delete Your Own Account

⚠️ **Warning**: This will log you out!

1. Find your own user account
2. Click **"Delete"**
3. Confirm deletion
4. ✅ Account is deleted
5. ✅ You're logged out
6. ✅ Redirected to login page

**Recovery**: Use demo admin account to login again

### Test 3: Empty Form Submission

1. Click **"Edit"** on any user
2. Clear the name field
3. Try to submit
4. ✅ Browser validation prevents submit
5. ✅ "Please fill out this field" message

### Test 4: Invalid Email Format

1. Click **"Edit"** on any user
2. Enter "notanemail" in email field
3. Try to submit
4. ✅ Browser validation prevents submit
5. ✅ "Please include an '@' in the email address"

### Test 5: Short Password

1. Click **"Edit"** on any user
2. Enter "123" in password field (less than 6 chars)
3. Try to submit
4. ✅ Validation error
5. ✅ "Password must be at least 6 characters"

## Database Verification

### Using Prisma Studio

1. Open Prisma Studio:
```bash
npm run prisma:studio
```

2. Navigate to http://localhost:5555

3. Click on "users" table

4. Verify changes:
   - ✅ Edited users show updated data
   - ✅ Deleted users are gone
   - ✅ Passwords are hashed (not plain text)
   - ✅ Avatars have file paths

### Manual Database Check

After editing a user:

1. In Prisma Studio, find the edited user
2. Check `updatedAt` timestamp - should be recent
3. Check `passwordHash` - should be a bcrypt hash
4. Check `image` - should have path like `/uploads/avatars/...`

After deleting a user:

1. Search for the user in Prisma Studio
2. ✅ User should not exist
3. ✅ UUID is no longer in database

## Performance Test

### Test Rapid Operations

1. Edit a user → Save (works ✅)
2. Immediately edit same user again (works ✅)
3. Edit, cancel, edit again (works ✅)
4. Delete user immediately after edit (works ✅)
5. Create user immediately after delete (works ✅)

### Test Multiple Modals

1. Open Create modal
2. Cancel
3. Open Edit modal
4. Cancel
5. Open Delete confirmation
6. Cancel
7. ✅ All modals work independently
8. ✅ No memory leaks or stuck states

## Success Criteria

All tests should pass:

- ✅ Edit button opens modal with user data
- ✅ Edit form pre-filled correctly
- ✅ Can update name, email, phone, role
- ✅ Password update is optional
- ✅ Avatar can be changed
- ✅ Email validation prevents duplicates
- ✅ Changes persist in database
- ✅ Page refreshes after update
- ✅ Delete button shows confirmation
- ✅ Cancel works without deleting
- ✅ Delete permanently removes user
- ✅ Cannot undo deletion
- ✅ Page refreshes after delete
- ✅ Search and filter still work
- ✅ No console errors
- ✅ Loading states display correctly
- ✅ Error messages are helpful

## Common Issues

### Modal doesn't close after save

**Fix**: Page should auto-refresh. Manually refresh if needed.

### Changes don't appear in table

**Fix**: 
```bash
# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

### "User not found" error

**Fix**: User was deleted by another session. Refresh the page.

### Image upload fails

**Fix**: Check that `/public/uploads/avatars/` folder exists and has write permissions.

## Rollback Testing

If something goes wrong:

1. Stop the dev server
2. Reset database:
```bash
npm run prisma:push -- --force-reset
npm run prisma:seed
```
3. Restart dev server:
```bash
npm run dev
```
4. All test data is back to original state

## Next Steps

After confirming everything works:

1. Test in production environment
2. Add more security features (prevent self-deletion, role checks)
3. Add activity logging
4. Implement soft delete (deactivate instead of delete)
5. Add bulk operations

## Report Issues

If any test fails:

1. Check browser console (F12) for errors
2. Check terminal for server errors
3. Verify database connection
4. Review the error message
5. Check [USER_MANAGEMENT.md](./USER_MANAGEMENT.md) for troubleshooting

---

**All tests passing?** 🎉 Your user management system is fully functional!
