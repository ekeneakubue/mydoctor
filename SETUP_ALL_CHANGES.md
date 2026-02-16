# Setup Guide: Apply All Changes

## Current Issues

You're experiencing errors because the database schema hasn't been updated with all the recent changes:

1. ✅ **PATIENT role** added to User model
2. ✅ **passwordHash** added to Patient model (for signup)
3. ✅ **passwordHash** added to Doctor model
4. ✅ Patient fields made optional (for easier signup)

**Your PostgreSQL database doesn't have these changes yet!**

## 🚨 One-Time Setup (Do This Now)

Run these commands **in order** to fix all errors:

### Step 1: Stop Dev Server
```bash
# In terminal, press: Ctrl+C
```

### Step 2: Generate Prisma Client
```bash
npm run prisma:generate
```

This updates TypeScript types with new fields.

### Step 3: Reset Database
```bash
npm run prisma:push -- --force-reset
```

**⚠️ This deletes all data!** But that's okay for development.

### Step 4: Seed Database
```bash
npm run prisma:seed
```

This creates:
- 1 Admin user (admin@mydoctor.com / admin123)
- 5 Sample patients (all with password: patient123)
- 6 Sample doctors (all with password: doctor123)

### Step 5: Clean Next.js Cache
```bash
Remove-Item -Path ".next" -Recurse -Force
```

### Step 6: Restart Dev Server
```bash
npm run dev
```

Wait for "Ready" message.

### Step 7: Hard Refresh Browser
```
Press: Ctrl + Shift + R
```

## ✅ After Setup

### Test Signup (Should Work Now)

1. Visit http://localhost:3000/signup
2. Fill in:
   - First Name: John
   - Last Name: Test
   - Email: john.test@email.com
   - Phone: +1234567890
   - Password: test123
   - Confirm: test123
3. Click "Create account"
4. ✅ **Success message appears**
5. ✅ Redirected to /login
6. Login with credentials
7. ✅ Redirected to home page

### Test Admin Login

1. Visit http://localhost:3000/login
2. Email: `admin@mydoctor.com`
3. Password: `admin123`
4. ✅ Login works
5. ✅ Redirected to /admin

### Test All Admin Features

1. **Users Management**: /admin/users
   - ✅ Create user
   - ✅ Edit user (with PATIENT role option)
   - ✅ Delete user

2. **Doctors Management**: /admin/doctors
   - ✅ Add doctor (with password)
   - ✅ Edit doctor
   - ✅ Delete doctor

3. **Patients Management**: /admin/patients
   - ✅ View patients
   - ✅ Delete patient

## 🎯 What These Commands Do

### `prisma:generate`
- Updates Prisma Client
- Adds new types (PATIENT role, etc.)
- Required after schema changes

### `prisma:push --force-reset`
- Drops all tables
- Recreates schema from scratch
- Applies all pending changes
- **Deletes all data!**

### `prisma:seed`
- Populates database with sample data
- Creates admin user
- Creates sample patients with passwords
- Creates sample doctors with passwords

## 📊 What You'll Get After Setup

### Users Table
- 1 Admin user

### Patients Table
- 5 Sample patients (all can login)

### Doctors Table
- 6 Sample doctors (all can login)

## 🔐 All Credentials

### Admin
- Email: admin@mydoctor.com
- Password: admin123

### Sample Patients
- Email: john.smith@email.com (and 4 others)
- Password: patient123

### Sample Doctors
- Email: dr.sarah.johnson@mydoctor.com (and 5 others)
- Password: doctor123

## 🔍 Verify Everything is Set Up

### Check 1: Prisma Studio
```bash
npm run prisma:studio
```

Visit http://localhost:5555 and verify:
- ✅ `users` table has admin
- ✅ `patients` table has 5 patients with passwordHash
- ✅ `doctors` table has 6 doctors with passwordHash

### Check 2: Test Each Login Type

1. **Admin Login**:
   - admin@mydoctor.com / admin123
   - Should redirect to `/admin`

2. **Patient Login**:
   - john.smith@email.com / patient123
   - Should redirect to `/`

3. **New Patient Signup**:
   - Create account at `/signup`
   - Should work without errors

## 🚫 Common Issues

### "Column 'passwordHash' does not exist"
**Solution**: Run `npm run prisma:push -- --force-reset`

### "An error occurred during signup"
**Solution**: Run all setup commands above

### "Email already in use"
**Solution**: Use different email OR reset database

### "Body exceeded 1MB limit"
**Solution**: 
1. Stop server (Ctrl+C)
2. Delete `.next` folder
3. Restart: `npm run dev`

## 📋 Quick Command Copy-Paste

Copy and paste these all at once:

```bash
npm run prisma:generate && npm run prisma:push -- --force-reset && npm run prisma:seed
```

Then separately:
```bash
Remove-Item -Path ".next" -Recurse -Force
npm run dev
```

## ✅ Success Checklist

After running all commands, verify:

- [ ] Signup form works (no errors)
- [ ] Can create new patient account
- [ ] Redirected to login after signup
- [ ] Can login with new patient account
- [ ] Admin login still works
- [ ] /admin/users loads without error
- [ ] /admin/doctors loads without error
- [ ] /admin/patients loads without error
- [ ] Can delete patients
- [ ] Can create/edit/delete doctors
- [ ] Can create/edit/delete users

If all checked, you're good to go! ✅

---

**Run the commands now to fix the signup error!** 🚀
