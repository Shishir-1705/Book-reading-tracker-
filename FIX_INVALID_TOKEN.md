# Fix "Invalid Token" Error

## ✅ What I Just Fixed

1. **JWT_SECRET now uses environment variable** - Matches the `.env` file
2. **Extended token expiry** - From 1 hour to 24 hours
3. **Better error messages** - Now shows specific token errors
4. **Improved logging** - Server logs token verification errors

## 🔧 What You Need to Do

### Step 1: Restart Backend Server

**Important:** The server needs to restart to use the new JWT_SECRET from `.env`

1. Stop the server: Press `Ctrl+C` in the terminal where `npm run server` is running
2. Start it again:
   ```bash
   npm run server
   ```

### Step 2: Clear Old Token and Re-login

The old token was created with a different JWT_SECRET, so it's invalid now.

1. **Open browser console** (F12)
2. **Go to Application tab** → Local Storage → `http://localhost:5173`
3. **Delete these items:**
   - `authToken`
   - `user`
4. **Refresh the page** (F5)
5. **Login again** (or Register if you don't have an account)

### Step 3: Try Adding a Book

After logging in with a fresh token, try adding a book again.

## Why This Happened

The JWT_SECRET was hardcoded in the server, but your `.env` file has a different value. When tokens were created, they used one secret, but when verified, they used another → "Invalid token" error.

## Verification

After restarting and re-logging in:

1. **Check browser console** (F12 → Console)
2. **Try adding a book**
3. **Should see:** `Response status: 201` (success!)
4. **No more "Invalid token" error**

## If Still Getting Errors

### Check Server Terminal

Look for token verification logs:
```
Token verification error: ...
Token received: ...
JWT_SECRET used: ...
```

This will show what's wrong.

### Common Issues

1. **"Token expired"** → Just login again (token is now valid for 24 hours)
2. **"Invalid token format"** → Clear localStorage and login again
3. **Still "Invalid token"** → Make sure server restarted after the fix

## Quick Fix Summary

1. ✅ Restart backend: `npm run server`
2. ✅ Clear localStorage (delete `authToken` and `user`)
3. ✅ Login again
4. ✅ Try adding book

The token should work now! 🎉

