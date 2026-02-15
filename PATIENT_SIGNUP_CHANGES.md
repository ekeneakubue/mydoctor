# Patient Signup System Changes

## Overview

The signup form now creates Patient records instead of User records. This separates system users (admins/staff) from healthcare patients.

## Major Changes

### 1. **Patient Model Updated** (`prisma/schema.prisma`)

Added authentication fields:
- ✅ `email` - Now required (was optional)
- ✅ `passwordHash` - New field for secure authentication
- ✅ Made optional: `dateOfBirth`, `gender`, `address`, `emergencyContact*`

This allows patients to sign up with minimal info and complete their profile later.

### 2. **Signup Form Updated** (`app/signup/page.tsx`)

New fields collected:
- ✅ First Name (split from full name)
- ✅ Last Name (split from full name)
- ✅ Email (required)
- ✅ Phone (required)
- ✅ Password (required, min 6 chars)
- ✅ Confirm Password (required)

### 3. **Signup Action Updated** (`app/actions/auth.ts`)

- ✅ Creates Patient record (not User)
- ✅ Stores in `patients` table
- ✅ Hashes password with bcrypt
- ✅ Validates email uniqueness in Patient table

### 4. **Login System Enhanced** (`app/actions/auth.ts`)

Login now checks **both tables**:
1. First checks `users` table (for ADMIN/STAFF)
2. Then checks `patients` table (for patients)
3. Sets appropriate session cookies

New cookie added:
- `user_type` - Stores "user" or "patient" for identification

### 5. **Seed Script Updated** (`prisma/seed.ts`)

- ✅ All sample patients now have passwords
- ✅ Default password: `patient123`
- ✅ Patients can log in for testing

## Database Separation

### Users Table (System Access)
- **Who**: Admins and Staff
- **Created By**: Admin through User Management
- **Purpose**: System administration
- **Access**: Admin dashboard

### Patients Table (Healthcare Records)
- **Who**: Healthcare patients
- **Created By**: Public signup form
- **Purpose**: Medical records and appointments
- **Access**: Patient portal (future feature)

## 🚨 REQUIRED: Update Database

You **MUST** run these commands to apply the schema changes:

### Step 1: Generate Prisma Client
```bash
npm run prisma:generate
```

### Step 2: Push Schema to Database
```bash
npm run prisma:push
```

**⚠️ Warning**: If you have existing patients without passwords, this will fail.

### If You Have Existing Patients:

#### Option A: Reset Database (Recommended for Development)
```bash
npm run prisma:push -- --force-reset
npm run prisma:seed
```

This deletes all data and creates fresh sample data.

#### Option B: Manually Add Passwords
1. Make `passwordHash` optional temporarily in schema
2. Push changes
3. Manually add passwords to existing patients
4. Make `passwordHash` required again
5. Push changes

### Step 3: Restart Dev Server
```bash
# Press Ctrl+C to stop
npm run dev
```

## How It Works Now

### Patient Signup Flow

```
User visits /signup
    ↓
Fills in: First Name, Last Name, Email, Phone, Password
    ↓
Form submitted to signup() action
    ↓
Patient record created in patients table
    ↓
Password hashed with bcrypt
    ↓
Success message shown
    ↓
Redirected to /login
    ↓
Patient logs in
    ↓
Redirected to home page (/)
```

### Login Flow (Unified)

```
User enters email/password at /login
    ↓
System checks users table first
    ↓
Found? → Login as ADMIN/STAFF → Redirect to /admin
    ↓
Not found? Check patients table
    ↓
Found? → Login as PATIENT → Redirect to /
    ↓
Not found? → Error: "Invalid email or password"
```

## Testing

### Test Patient Signup

1. Visit http://localhost:3000/signup
2. Fill in the form:
   - First Name: Test
   - Last Name: Patient
   - Email: test.patient@email.com
   - Phone: +1 555 9999
   - Password: test123
   - Confirm: test123
3. Click "Create account"
4. ✅ Patient created in `patients` table
5. ✅ Redirected to login
6. Login with credentials
7. ✅ Redirected to home page (/)

### Test Patient Login with Sample Data

After running seed script:

**Sample Patient Credentials**:
- Email: `john.smith@email.com`
- Password: `patient123`

Try logging in:
1. Visit http://localhost:3000/login
2. Enter sample patient credentials
3. ✅ Should login successfully
4. ✅ Redirected to home page (/)

### Test Admin Login Still Works

1. Visit http://localhost:3000/login
2. Enter admin credentials:
   - Email: `admin@citycare.com`
   - Password: `admin123`
3. ✅ Should login successfully
4. ✅ Redirected to admin dashboard (/admin)

### Verify in Database

```bash
npm run prisma:studio
```

1. Open http://localhost:5555
2. Check **patients** table
3. ✅ New signups appear here (not in users table)
4. ✅ passwordHash is present and hashed
5. Check **users** table
6. ✅ Only admin/staff accounts here

## Updated Form Fields

**Old Signup Form** (User):
- Full Name
- Email
- Password
- Confirm Password

**New Signup Form** (Patient):
- First Name
- Last Name
- Email
- Phone
- Password
- Confirm Password

## Profile Completion (Future Feature)

Since many Patient fields are now optional, you can build a profile completion page where patients add:
- Date of Birth
- Gender
- Address
- Blood Type
- Allergies
- Medical History
- Insurance Info
- Emergency Contact

## Session Cookies

After login, these cookies are set:

**For Patients**:
- `user_id` - Patient's UUID
- `user_role` - "PATIENT"
- `user_email` - Patient's email
- `user_type` - "patient" (identifies table)

**For Users** (Admin/Staff):
- `user_id` - User's UUID
- `user_role` - "ADMIN" or "STAFF"
- `user_email` - User's email
- `user_type` - "user" (identifies table)

## Security Considerations

### ✅ Benefits

- **Separation of concerns**: System users vs patients
- **Better data model**: Patient-specific fields in Patient table
- **Unified login**: Single login page for everyone
- **Same security**: bcrypt hashing for all passwords

### ⚠️ Considerations

- Email must be unique across patients (can't have duplicate patient emails)
- Patient and User can have same email (different tables)
- Middleware already handles PATIENT role correctly
- No changes needed to route protection

## Sample Credentials After Seed

### Admin (System User)
- Email: `admin@citycare.com`
- Password: `admin123`
- Table: `users`
- Role: ADMIN

### Sample Patients
All patients use password: `patient123`

1. `john.smith@email.com` (Table: `patients`)
2. `emily.j@email.com` (Table: `patients`)
3. `mwilliams@email.com` (Table: `patients`)
4. `sarah.davis@email.com` (Table: `patients`)
5. `james.brown@email.com` (Table: `patients`)

### Sample Doctors
All doctors use password: `doctor123`

- Various `dr.*@citycare.com` emails (Table: `doctors`)

## Migration Checklist

- [x] Updated Patient model with passwordHash
- [x] Made email required in Patient model
- [x] Made optional: dateOfBirth, gender, address, emergency contacts
- [x] Updated signup form with patient fields
- [x] Updated signup action to create Patient
- [x] Updated login to check both tables
- [x] Updated getCurrentUser to handle patients
- [x] Updated logout to clear user_type cookie
- [x] Updated seed script with patient passwords

## Next Steps

1. **Run database migration commands** (see above)
2. **Test patient signup and login**
3. **Build patient dashboard/portal** (future)
4. **Add profile completion page** (future)
5. **Add appointment booking** (future)

## Troubleshooting

### "Column 'passwordHash' cannot be null"
**Solution**: Reset database or make field optional temporarily

### "Unique constraint failed on email"
**Solution**: Use different email address

### Patient can't login
**Solution**: Make sure you ran the seed script after schema update

### Admin login broken
**Solution**: Login still works for users table - should work fine

---

**Remember**: Run `npm run prisma:generate`, `npm run prisma:push`, and reseed! 🚀
