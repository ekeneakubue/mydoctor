# Fix: "An error occurred during signup"

## Root Cause

The signup error is happening because **your database schema hasn't been updated** with the recent changes to the Patient model.

## What Changed

We made several changes to support patient signup:
1. Added `passwordHash` field to Patient model
2. Made `email` required (was optional)
3. Made optional: `dateOfBirth`, `gender`, `address`, `emergencyContactName`, `emergencyContactPhone`

**Your database doesn't have these changes yet!**

## 🚨 REQUIRED FIX: Update Database

Run these commands **in order**:

### Step 1: Generate Prisma Client
```bash
npm run prisma:generate
```

This updates TypeScript types and Prisma Client.

### Step 2: Push Schema to Database
```bash
npm run prisma:push -- --force-reset
```

**⚠️ Warning**: This will DELETE all existing data!

For development, this is fine. The `--force-reset` flag is needed because:
- Adding required `passwordHash` to existing patients
- Changing `email` from optional to required
- Existing patients don't have passwords

### Step 3: Seed Database
```bash
npm run prisma:seed
```

This creates:
- Admin user
- 5 Sample patients **with passwords**
- 6 Sample doctors with passwords

### Step 4: Restart Dev Server
```bash
# Press Ctrl+C to stop server
npm run dev
```

## 🎯 After Running Commands

Try signing up again:

1. Visit http://localhost:3000/signup
2. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Phone: +1234567890
   - Password: test123
   - Confirm: test123
3. Click "Create account"
4. ✅ Should work now!
5. ✅ Success message appears
6. ✅ Redirected to login
7. Login with your new credentials
8. ✅ Works!

## 🔍 Verify Schema is Updated

Check if the Patient table has the new structure:

```bash
npm run prisma:studio
```

1. Open http://localhost:5555
2. Click on **"patients"** table
3. Look at the columns - you should see:
   - ✅ `passwordHash` (new column)
   - ✅ `email` (not nullable)
   - ✅ `dateOfBirth` (nullable)
   - ✅ `gender` (nullable)
   - ✅ `address` (nullable)
   - ✅ `emergencyContactName` (nullable)
   - ✅ `emergencyContactPhone` (nullable)

## 🧪 Test Everything Works

### Test 1: Patient Signup
```
1. Visit /signup
2. Create new patient account
3. ✅ No errors
4. ✅ Redirected to login
5. ✅ Can login with credentials
```

### Test 2: Sample Patient Login
```
1. Visit /login
2. Email: john.smith@email.com
3. Password: patient123
4. ✅ Login works
5. ✅ Redirected to home page (/)
```

### Test 3: Admin Login Still Works
```
1. Visit /login
2. Email: admin@citycare.com
3. Password: admin123
4. ✅ Login works
5. ✅ Redirected to /admin dashboard
```

### Test 4: View Patients in Admin
```
1. Login as admin
2. Visit /admin/patients
3. ✅ See sample patients
4. ✅ Can delete patients
```

## 📝 Alternative: Production Migration

If you're in production and can't delete data, you need a proper migration:

```bash
# Create migration
npm run prisma:migrate dev --name add_patient_auth

# Apply migration
npm run prisma:migrate deploy
```

But for development, the reset approach above is easier.

## 🔍 Check Current Database State

To see if you need to update:

```bash
npm run prisma:studio
```

1. Open patients table
2. Look for `passwordHash` column
3. **If it doesn't exist** → You need to run the commands above
4. **If it exists** → Check for different error (see below)

## 🐛 Other Possible Errors

### Error: "Email already in use"
**Cause**: Patient with that email already exists

**Solution**: Use a different email address

### Error: "Invalid form data"
**Cause**: Form validation failed

**Solution**: 
- Check all fields are filled
- Password min 6 characters
- Passwords match

### Error: "Database not updated"
**Cause**: Missing passwordHash column

**Solution**: Run the prisma commands above

## 💡 Quick Diagnosis

Try signing up and check the error message:

**If you see**:
- "An error occurred during signup" → **Database not updated** (run commands)
- "Email already in use" → Change email
- "Password must be at least 6 characters" → Longer password
- "Passwords do not match" → Fix password confirmation
- "Invalid form data" → Check all fields filled

## 📊 Schema Comparison

### OLD Patient Schema (Before Changes)
```prisma
model Patient {
  email         String?   @unique  // Optional
  phone         String
  dateOfBirth   DateTime            // Required
  gender        Gender              // Required
  address       String              // Required
  // No passwordHash
  emergencyContactName  String      // Required
  emergencyContactPhone String      // Required
}
```

### NEW Patient Schema (After Changes)
```prisma
model Patient {
  email         String    @unique  // Required ✅
  passwordHash  String              // New ✅
  phone         String
  dateOfBirth   DateTime?           // Optional ✅
  gender        Gender?             // Optional ✅
  address       String?             // Optional ✅
  emergencyContactName  String?     // Optional ✅
  emergencyContactPhone String?     // Optional ✅
}
```

## Summary

**The Problem**: Database schema is outdated

**The Solution**: Run these 4 commands:
```bash
npm run prisma:generate
npm run prisma:push -- --force-reset
npm run prisma:seed
npm run dev
```

**Then try signup again** - it will work! ✅

---

**TL;DR**: Your database needs updating. Run the commands above to fix the signup error! 🚀
