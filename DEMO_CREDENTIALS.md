# Demo Login Credentials

## How to Login

1. Navigate to the login page: http://localhost:3000/login
2. Enter your credentials
3. Click "Sign in"
4. You'll be redirected based on your role

## Admin Account

Use these credentials to access the admin dashboard:

- **Email:** `admin@mydoctor.com`
- **Password:** `admin123`
- **Role:** ADMIN
- **Login URL:** http://localhost:3000/login

## Sample Doctor Accounts

All sample doctors have the same password for easy testing:

**Default Doctor Password:** `doctor123`

### Doctor Logins:

1. **Dr. Sarah Johnson** (Cardiology)
   - Email: `dr.sarah.johnson@mydoctor.com`
   - Password: `doctor123`

2. **Dr. Michael Chen** (Neurology)
   - Email: `dr.michael.chen@mydoctor.com`
   - Password: `doctor123`

3. **Dr. Emily Rodriguez** (Pediatrics)
   - Email: `dr.emily.rodriguez@mydoctor.com`
   - Password: `doctor123`

4. **Dr. David Thompson** (Orthopedics)
   - Email: `dr.david.thompson@mydoctor.com`
   - Password: `doctor123`

5. **Dr. Jennifer Lee** (Dermatology)
   - Email: `dr.jennifer.lee@mydoctor.com`
   - Password: `doctor123`

6. **Dr. Robert Williams** (Internal Medicine)
   - Email: `dr.robert.williams@mydoctor.com`
   - Password: `doctor123`

**Note**: Doctors currently log in through the same login page. In the future, you can create a separate doctor portal.

## Create New Patient Account

Don't have an account? You can create one:

1. Go to: http://localhost:3000/signup
2. Fill in your details (First Name, Last Name, Email, Phone, Password)
3. New signups create **Patient** records (not Users)
4. You'll need to login after signup
5. Patients are redirected to home page (/) after login

## Sample Patient Logins

All sample patients use the same password: **`patient123`**

1. **John Smith**
   - Email: `john.smith@email.com`
   - Password: `patient123`

2. **Emily Johnson**
   - Email: `emily.j@email.com`
   - Password: `patient123`

3. **Michael Williams**
   - Email: `mwilliams@email.com`
   - Password: `patient123`

4. **Sarah Davis**
   - Email: `sarah.davis@email.com`
   - Password: `patient123`

5. **James Brown**
   - Email: `james.brown@email.com`
   - Password: `patient123`

## Setup Instructions

If the demo admin account is not yet created in your database:

1. Make sure your `.env` file contains:
   ```env
   DEMO_ADMIN_EMAIL="admin@mydoctor.com"
   DEMO_ADMIN_PASSWORD="admin123"
   DEMO_ADMIN_NAME="Admin User"
   ```

2. Run the seed script:
   ```bash
   npm run prisma:seed
   ```

3. The script will create the admin user if it doesn't already exist.

## Security Note

⚠️ **Important:** These are demo credentials for development/testing only. 

For production:
- Change the password to a strong, unique value
- Update the email to a real admin email
- Use environment variables for sensitive data
- Never commit production credentials to version control

## Authentication Features

✅ **Implemented**:
- Secure login with email and password
- User registration (signup)
- Password hashing with bcrypt
- Cookie-based sessions (7 days)
- Protected admin routes
- Logout functionality
- Auto-redirect for authenticated users
- Form validation with helpful error messages

## Available Admin Features

After logging in, you can access:

- **Dashboard** - Overview of system metrics
- **Users** - Manage user accounts and roles
- **Patients** - View and manage patient records
- **Doctors** - View and manage doctor profiles
- **Settings** - System configuration
- **Profile** - View your account info in sidebar
- **Logout** - Securely end your session

## Testing Authentication

### Test Login Flow

1. Visit http://localhost:3000/admin (without logging in)
2. You should be redirected to `/login`
3. Enter demo admin credentials
4. You should be redirected back to `/admin`

### Test Signup Flow

1. Visit http://localhost:3000/signup
2. Create a new account with:
   - Full name
   - Email (unique)
   - Password (min 6 characters)
   - Confirm password
3. You'll be logged in automatically
4. Check the sidebar - your name should appear

### Test Protected Routes

1. Open an incognito/private window
2. Try to visit http://localhost:3000/admin
3. You should be redirected to login
4. After logging in, try to visit `/login` again
5. You should be redirected to `/admin`

### Test Logout

1. Login to the dashboard
2. Click "Logout" button in the sidebar (bottom)
3. You should be redirected to `/login`
4. Try to access `/admin` - you should be redirected to login

## Roles Explained

### ADMIN Role
- Full system access
- Can manage all users
- Can promote/demote roles
- Created via seed script or manual database entry

### STAFF Role
- Default role for new signups
- Access to admin dashboard
- Limited permissions (can be extended)
- Can view and manage patients/doctors

## Troubleshooting

### "Invalid email or password"
- Double-check your credentials
- Make sure you ran the seed script for admin user
- Check if the user exists in the database

### Can't create account
- Email might already be in use
- Password must be at least 6 characters
- Make sure passwords match
- Check database connection

### Logged out automatically
- Sessions expire after 7 days
- Cookies might be blocked
- Browser privacy settings might clear cookies

### Not redirected after login
- Check browser console for errors
- Make sure JavaScript is enabled
- Try clearing browser cache

For detailed authentication documentation, see [AUTHENTICATION.md](./AUTHENTICATION.md)
