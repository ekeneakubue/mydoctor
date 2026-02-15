# Database Setup Guide

This guide explains how to set up and populate your CityCare database.

## Prerequisites

- PostgreSQL database (Neon DB configured)
- Node.js installed
- Environment variables set in `.env`

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Prisma Client

```bash
npm run prisma:generate
```

### 3. Push Database Schema

Push the Prisma schema to your database:

```bash
npm run prisma:push
```

This command will:
- Create all tables (users, patients, doctors)
- Set up relationships and constraints
- Apply all enums (Role, Gender)

### 4. Seed Sample Data

Populate your database with demo data:

```bash
npm run prisma:seed
```

This will create:
- **1 Admin User** - For logging into the system
  - Email: `admin@citycare.com`
  - Password: `admin123`
  
- **5 Sample Patients** - Test patient records
  - John Smith, Emily Johnson, Michael Williams, Sarah Davis, James Brown
  
- **6 Sample Doctors** - Test doctor profiles
  - Dr. Sarah Johnson (Cardiology)
  - Dr. Michael Chen (Neurology)
  - Dr. Emily Rodriguez (Pediatrics)
  - Dr. David Thompson (Orthopedics)
  - Dr. Jennifer Lee (Dermatology)
  - Dr. Robert Williams (Internal Medicine)

### 5. Verify Setup

Open Prisma Studio to view your data:

```bash
npm run prisma:studio
```

This will open a web interface at `http://localhost:5555` where you can browse all your tables and data.

## Database Structure

### Users Table
- Stores admin and staff user accounts
- Uses bcrypt for password hashing
- Role-based access control (ADMIN/STAFF)

### Patients Table
- Complete patient information
- Medical history and insurance details
- Emergency contact information
- Track last visit and active status

### Doctors Table
- Doctor profiles and specializations
- License numbers and contact information
- Department assignments
- Availability schedules (JSON format)

## Common Commands

```bash
# View database in browser
npm run prisma:studio

# Reset and reseed database (careful - deletes all data!)
npm run prisma:push -- --force-reset
npm run prisma:seed

# Create a new migration
npm run prisma:migrate

# Generate Prisma Client after schema changes
npm run prisma:generate
```

## Troubleshooting

### Connection Issues
If you can't connect to the database:
1. Check your `DATABASE_URL` in `.env`
2. Ensure your IP is whitelisted in Neon DB
3. Verify SSL mode is set to `require`

### Seed Script Fails
If the seed script fails:
1. Make sure the schema is pushed: `npm run prisma:push`
2. Check for unique constraint violations (email/license numbers)
3. The seed script is idempotent - it won't create duplicates

### Schema Changes Not Reflecting
After modifying `prisma/schema.prisma`:
1. Run `npm run prisma:generate` to update the Prisma Client
2. Run `npm run prisma:push` to update the database
3. Restart your development server

## Next Steps

1. Start the development server: `npm run dev`
2. Navigate to `/admin` and log in with admin credentials
3. View patients at `/admin/patients`
4. View doctors at `/admin/doctors`
5. Manage users at `/admin/users`

## Security Notes

⚠️ **Important**: The seeded data is for development only!

Before deploying to production:
- Change all default passwords
- Update email addresses to real ones
- Remove or modify sample patient/doctor data
- Set strong `DATABASE_URL` credentials
- Never commit `.env` file to version control
