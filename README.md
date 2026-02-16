# MyDoctor - Healthcare Management System

A modern healthcare management system built with Next.js, Prisma, and PostgreSQL.

## Features

- 🔐 **Secure Authentication** - Login/Signup with bcrypt password hashing
- 🛡️ **Protected Routes** - Middleware-based route protection with role validation
- 🎭 **Role-Based Access Control** - Three-tier system (PATIENT, STAFF, ADMIN)
- 👥 **User Management** - Complete CRUD operations for users
- 🏥 **Patient Management** - Complete patient records and history
- 👨‍⚕️ **Doctor Management** - Doctor profiles and specializations
- 📊 **Admin Dashboard** - Overview of key metrics and statistics
- 🔄 **Auto-Redirects** - Smart routing based on user roles

## Getting Started

### Prerequisites

- Node.js 20+ installed
- PostgreSQL database (Neon DB configured)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables in `.env`:

```env
DATABASE_URL="your-database-url"
DEMO_ADMIN_EMAIL="admin@mydoctor.com"
DEMO_ADMIN_PASSWORD="admin123"
DEMO_ADMIN_NAME="Admin User"
```

3. Push the database schema and seed the demo admin:

```bash
npm run prisma:push
npm run prisma:seed
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Demo Admin Credentials

After running the seed script, you can log in with:

- **Email:** admin@mydoctor.com
- **Password:** admin123

Access the login page at [http://localhost:3000/login](http://localhost:3000/login)

Or create a new account at [http://localhost:3000/signup](http://localhost:3000/signup)

**Note**: New users get STAFF role by default. The seeded admin has ADMIN role.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run prisma:push` - Push schema to database
- `npm run prisma:seed` - Seed demo admin user
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:migrate` - Run database migrations

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Cookie-based with bcryptjs
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Validation:** Zod
- **State Management:** React Hooks

## Documentation

- [Quick Start Guide](./QUICK_START.md) - Get started in 5 minutes
- [Authentication Guide](./AUTHENTICATION.md) - Complete authentication documentation
- [Role-Based Access Control](./ROLE_BASED_ACCESS.md) - Understanding user roles and permissions
- [User Management Guide](./USER_MANAGEMENT.md) - Create, edit, delete users
- [Database Setup](./DATABASE_SETUP.md) - Database configuration and seeding
- [Demo Credentials](./DEMO_CREDENTIALS.md) - Login credentials for testing

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
