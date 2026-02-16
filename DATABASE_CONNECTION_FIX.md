# Fix: Database Connection Error

## Error

```
Can't reach database server at `ep-empty-violet-aiucbsn5-pooler.c-4.us-east-1.aws.neon.tech:5432`
```

## Possible Causes

### 1. Neon Database is Paused/Suspended
Neon free tier databases automatically pause after inactivity.

### 2. Network/Firewall Issues
Your internet connection or firewall may be blocking the connection.

### 3. Invalid Credentials
The database credentials might have changed or expired.

### 4. Database Endpoint Changed
Neon may have changed your database endpoint.

## 🔧 Quick Fixes

### Fix 1: Wake Up Neon Database

1. Visit https://console.neon.tech
2. Log in to your account
3. Find your project: `mydoctor` or similar
4. Click on the project
5. The database should automatically wake up
6. Wait 10-30 seconds
7. Try your app again

### Fix 2: Test Connection

Run this command to test the database connection:

```bash
npx prisma db push
```

**If it works**: Database is accessible, just needed wake-up time

**If it fails**: Continue to next fixes

### Fix 3: Get Fresh Connection String

1. Go to https://console.neon.tech
2. Click on your project
3. Click "Connection Details" or "Connection String"
4. Copy the connection string
5. Update your `.env` file:

```env
DATABASE_URL="your-new-connection-string-here"
```

### Fix 4: Check Internet Connection

```bash
# Ping Google to test internet
ping google.com

# If this fails, check your internet connection
```

### Fix 5: Use Direct URL (Not Pooler)

Neon provides two connection strings:
- **Pooler** (for serverless): `pooler.c-4.us-east-1.aws.neon.tech`
- **Direct** (for always-on): `ep-empty-violet-aiucbsn5.c-4.us-east-1.aws.neon.tech`

Try using the direct connection:

In your `.env`:
```env
DATABASE_URL="postgresql://neondb_owner:npg_JSZE8zh6YNam@ep-empty-violet-aiucbsn5.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

(Remove `-pooler` from the hostname)

### Fix 6: Restart Everything

```bash
# Stop server
Ctrl+C

# Clear cache
Remove-Item -Path ".next" -Recurse -Force

# Restart
npm run dev
```

## 🧪 Test Connection Manually

### Using Prisma Studio

```bash
npx prisma studio
```

**If it opens**: Connection works
**If it fails**: Database issue

### Using Prisma Command

```bash
npx prisma db pull
```

**If it works**: Connection is good
**If it fails**: Check error message

## 🔍 Debug Steps

### Step 1: Check Neon Dashboard

1. Visit https://console.neon.tech
2. Log in
3. Check your project status
4. Look for:
   - ✅ Status: "Active" (good)
   - ⚠️ Status: "Paused" (need to wake up)
   - ❌ Status: "Suspended" (payment issue?)

### Step 2: Verify .env File

Check your `.env` file:
```bash
type .env
```

Make sure:
- ✅ DATABASE_URL is on one line
- ✅ No extra spaces
- ✅ Proper quotes
- ✅ Correct credentials

### Step 3: Check Firewall

If using corporate network or VPN:
- May be blocking port 5432 (PostgreSQL)
- Try different network
- Disable VPN temporarily

## 🆘 Alternative: Use Local Database

If Neon continues to have issues, switch to local PostgreSQL:

### Install PostgreSQL Locally

1. Download from https://www.postgresql.org/download/windows/
2. Install PostgreSQL 16
3. Create database: `mydoctor`
4. Update `.env`:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/mydoctor"
```

Then:
```bash
npm run prisma:push
npm run prisma:seed
npm run dev
```

## 📱 Contact Neon Support

If nothing works:

1. Go to https://neon.tech/docs/introduction
2. Check their status page
3. Contact support
4. Verify your account status

## ✅ Quick Checklist

Try these in order:

1. [ ] Visit Neon console to wake database
2. [ ] Wait 30 seconds and try again
3. [ ] Get fresh connection string from Neon
4. [ ] Try direct URL (remove -pooler)
5. [ ] Check internet connection
6. [ ] Test with `npx prisma studio`
7. [ ] Restart dev server
8. [ ] Consider local PostgreSQL

## 🎯 Most Common Solution

**90% of the time**, the issue is:
1. Neon database is paused (free tier auto-pauses)
2. Just visit Neon console
3. Click on your project
4. Database wakes up automatically
5. Wait 10-30 seconds
6. Try your app again
7. ✅ Works!

---

**TL;DR**: Visit https://console.neon.tech, click on your project to wake it up, wait 30 seconds, and try again! 🚀
