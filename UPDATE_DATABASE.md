# URGENT: Update Database Schema

## Issue: "Failed to update user. Please try again."

This error occurs because the database schema doesn't include the new PATIENT role yet.

## Solution: Run These Commands

### Step 1: Generate Prisma Client
```bash
npm run prisma:generate
```

This regenerates the Prisma Client with the new PATIENT role.

### Step 2: Push Schema to Database
```bash
npm run prisma:push
```

This updates your PostgreSQL database with the new PATIENT role.

**IMPORTANT**: This will add PATIENT to the Role enum in your database.

### Step 3: Restart Dev Server
```bash
# Press Ctrl+C to stop the server
npm run dev
```

## What These Commands Do

### `prisma:generate`
- Updates TypeScript types
- Adds PATIENT to Role enum in client
- Required for code to recognize new role

### `prisma:push`
- Pushes schema changes to database
- Updates the Role enum in PostgreSQL
- **Without this, updates will fail!**

## Verification

After running the commands, verify the role was added:

```bash
npm run prisma:studio
```

1. Open http://localhost:5555
2. Click on "users" table
3. Look at any user's "role" field
4. You should see: PATIENT, STAFF, ADMIN as options

## If You Get Errors

### Error: "The table `users` does not exist"
```bash
npm run prisma:push -- --force-reset
npm run prisma:seed
```

### Error: "Environment variable not found"
Check your `.env` file has `DATABASE_URL`

### Error: "Cannot connect to database"
1. Check your Neon DB is running
2. Verify DATABASE_URL in `.env`
3. Check your internet connection

## Quick Test After Update

1. Visit http://localhost:3000/admin/users
2. Click "Edit" on any user
3. Change the role dropdown
4. You should see: PATIENT, STAFF, ADMIN
5. Click "Update User"
6. ✅ Should work now!

## Why This Happened

When we added the PATIENT role to `prisma/schema.prisma`, the code changed but the database didn't. Prisma needs to push these changes to your PostgreSQL database.

```prisma
// OLD schema
enum Role {
  STAFF
  ADMIN
}

// NEW schema  
enum Role {
  PATIENT  // <-- Added this
  STAFF
  ADMIN
}
```

The database still only knows about STAFF and ADMIN, so when you try to save a user, it rejects the PATIENT role.

## Still Not Working?

If you still get errors after running the commands:

1. **Check the terminal output** for any error messages
2. **Look at the browser console** (F12) for client-side errors
3. **Check the dev server logs** for detailed error messages
4. **Share the error message** so I can help debug further

---

**Run the commands now and the update should work!** 🚀
