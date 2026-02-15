# Quick Start Guide

Get your CityCare application up and running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- PostgreSQL database (you have Neon DB configured)

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js, React
- Prisma (database ORM)
- bcryptjs (password hashing)
- Zod (validation)
- Lucide React (icons)

## Step 2: Setup Database

Push the database schema:

```bash
npm run prisma:push
```

This creates all tables (users, patients, doctors) in your database.

## Step 3: Seed Demo Data

```bash
npm run prisma:seed
```

This creates:
- 1 Admin user (admin@citycare.com)
- 5 Sample patients
- 6 Sample doctors

## Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Step 5: Test Authentication

### Option A: Login with Demo Admin

1. Visit http://localhost:3000/login
2. Enter credentials:
   - Email: `admin@citycare.com`
   - Password: `admin123`
3. Click "Sign in"
4. ✅ You're now in the admin dashboard!

### Option B: Create a New Account

1. Visit http://localhost:3000/signup
2. Fill in the form:
   - Full name: Your Name
   - Email: your@email.com
   - Password: password123 (min 6 characters)
   - Confirm password: password123
3. Click "Create account"
4. ✅ You're automatically logged in!

## Step 6: Explore the Dashboard

After logging in, explore:

- **Dashboard** (`/admin`) - System overview
- **Users** (`/admin/users`) - Manage user accounts
- **Patients** (`/admin/patients`) - View sample patient records
- **Doctors** (`/admin/doctors`) - View sample doctor profiles
- **Settings** (`/admin/settings`) - Configuration

## What's Working Now

✅ **Authentication System**
- Login with email/password
- User registration
- Secure password hashing
- Cookie-based sessions
- Auto-redirect for logged-in users

✅ **Protected Routes**
- `/admin/*` routes require login
- Middleware redirects unauthenticated users
- Logged-in users can't access login/signup pages

✅ **User Management**
- View current user in sidebar
- Logout functionality
- Role-based access (ADMIN/STAFF)

✅ **Data Fetching**
- Patients loaded from database
- Doctors loaded from database
- Real-time data display

## Common Tasks

### View Database

Open Prisma Studio to browse your data:

```bash
npm run prisma:studio
```

Visit http://localhost:5555 to see all your data in a nice UI.

### Add More Sample Data

Just run the seed script again:

```bash
npm run prisma:seed
```

It won't create duplicates - it checks if data exists first.

### Reset Database

⚠️ **Warning**: This deletes all data!

```bash
npm run prisma:push -- --force-reset
npm run prisma:seed
```

### Check Authentication Status

Open browser DevTools → Application → Cookies → localhost:3000

You should see:
- `user_id` - Your user UUID
- `user_role` - Your role (ADMIN/STAFF)
- `user_email` - Your email

## Troubleshooting

### Port 3000 already in use

```bash
# Kill the process or use a different port
npm run dev -- -p 3001
```

### Database connection error

1. Check your `.env` file has the correct `DATABASE_URL`
2. Make sure your Neon DB is accessible
3. Try running `npm run prisma:push` again

### Login not working

1. Make sure you ran `npm run prisma:seed`
2. Check credentials: `admin@citycare.com` / `admin123`
3. Open browser console (F12) to see error messages
4. Clear cookies and try again

### Can't see sample data

1. Run `npm run prisma:seed` again
2. Check `npm run prisma:studio` to verify data exists
3. Refresh the page in your browser

## Next Steps

Now that everything is working, you can:

1. **Customize the UI** - Edit components in `components/` folder
2. **Add Features** - Create new pages in `app/` folder
3. **Extend Database** - Modify `prisma/schema.prisma`
4. **Add API Routes** - Create API endpoints in `app/api/`
5. **Deploy** - Deploy to Vercel or your preferred platform

## Documentation

For more detailed information:

- [README.md](./README.md) - Project overview
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Auth system details
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database guide
- [DEMO_CREDENTIALS.md](./DEMO_CREDENTIALS.md) - Login credentials

## Need Help?

Check the documentation files above or review the error messages in:
- Browser console (F12)
- Terminal where `npm run dev` is running
- Prisma Studio for database issues

---

**That's it! You're ready to go! 🚀**

Happy coding!
