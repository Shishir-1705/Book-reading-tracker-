# Clear Token and Re-login Instructions

## The Problem

Your browser has an **old token** stored in localStorage that was created before the server was updated. This token is now invalid.

## Solution: Clear Token and Login Again

### Method 1: Using Browser Console (Easiest)

1. **Open your app** in browser: `http://localhost:5173`
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Type these commands and press Enter after each:**

```javascript
localStorage.removeItem('authToken')
localStorage.removeItem('user')
location.reload()
```

5. **After page reloads, login again**
6. **Try adding a book**

### Method 2: Using Application Tab

1. **Press F12** → **Application tab** (or **Storage** in Firefox)
2. **Click Local Storage** → `http://localhost:5173`
3. **Right-click and Delete** these items:
   - `authToken`
   - `user`
4. **Refresh the page** (F5)
5. **Login again**
6. **Try adding a book**

### Method 3: Clear All Site Data

1. **Press F12** → **Application tab**
2. **Click "Clear site data"** button (top)
3. **Refresh the page**
4. **Login again**

## Verify Token is Cleared

After clearing, check:

1. **Press F12** → **Console tab**
2. **Type:** `localStorage.getItem('authToken')`
3. **Should show:** `null`

If it shows a token string, it wasn't cleared properly.

## After Re-login

1. **Login** (or Register if new user)
2. **Check console:** `localStorage.getItem('authToken')`
3. **Should show:** A long token string (this is the new valid token)
4. **Try adding a book** - should work now!

## Still Getting Error?

If you still get "Invalid token" after clearing and re-logging:

1. **Check server terminal** - Look for token verification error logs
2. **Make sure server restarted** after the code changes
3. **Try restarting server:**
   - Stop: `Ctrl+C` in server terminal
   - Start: `npm run server`
4. **Clear token and login again**

