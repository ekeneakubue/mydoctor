# Fix: Body Exceeded 1MB Limit Error

## Quick Fix Steps

Follow these steps **in order**:

### Step 1: Stop the Dev Server

In your terminal where `npm run dev` is running:
1. Click on the terminal window
2. Press **`Ctrl + C`** to stop the server
3. Wait until you see the prompt again

### Step 2: Delete Cache Folders

Run these commands **one at a time**:

```powershell
# Delete .next cache
Remove-Item -Path ".next" -Recurse -Force

# Delete node_modules/.cache (if exists)
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
```

Or manually:
1. Open your project folder in File Explorer
2. Delete the `.next` folder (it will be recreated)

### Step 3: Restart Dev Server

```bash
npm run dev
```

Wait for the build to complete (you'll see "Ready" message).

### Step 4: Test

Visit http://localhost:3000/admin/users

✅ The error should be gone!

## What Was Changed

I made two important fixes in your code:

### 1. Next.js Config (`next.config.ts`)
```typescript
serverActions: {
  bodySizeLimit: '5mb', // Increased from default 1MB
}
```

### 2. Users Page Security Fix (`app/admin/users/page.tsx`)
```typescript
// Now excludes passwordHash from being sent to client
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
    role: true,
    phone: true,
    image: true,
    createdAt: true,
    updatedAt: true,
    // passwordHash excluded ✅
  }
});
```

## Why This Happened

The error occurred because:
1. **Server Actions have 1MB default limit** for form data
2. **Image uploads** can be large (avatars, etc.)
3. **Old cache** was using old config settings
4. **Security issue**: Password hashes being sent unnecessarily

## If Still Not Working

### Check if Next.js Config is Correct

```bash
type next.config.ts
```

Should show:
```typescript
serverActions: {
  bodySizeLimit: '5mb',
}
```

### Force Clean Build

```bash
# Stop server (Ctrl+C)
Remove-Item -Path ".next" -Recurse -Force
npm run dev -- --turbopack
```

### Check for Multiple Node Processes

```bash
# See all node processes
Get-Process node

# If multiple processes, kill them all:
Stop-Process -Name node -Force
```

Then restart:
```bash
npm run dev
```

## Testing File Uploads

After fixing, test with a large image:

1. Go to `/admin/users`
2. Click "Add User"
3. Upload a larger avatar (< 5MB)
4. Fill in the form
5. Click "Create User"
6. ✅ Should work now!

## Why 5MB?

- Default 1MB is too small for images
- 5MB allows comfortable room for avatars
- Still prevents abuse (not unlimited)
- Industry standard for file uploads

## Alternative: Reduce Image Sizes

If you still have issues, you can add client-side image compression:

```typescript
// Before upload, compress images
const compressImage = async (file: File) => {
  // Compress to max 500KB
  // Convert to WebP format
  // Resize to max 512x512
}
```

But with 5MB limit, this shouldn't be necessary.

---

**TL;DR**: 
1. Press Ctrl+C to stop server
2. Delete `.next` folder
3. Run `npm run dev`
4. Problem solved! ✅
