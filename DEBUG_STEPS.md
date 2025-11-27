# Debug Steps for "Failed to fetch" Error

## Step 1: Verify Backend is Running

Open PowerShell and run:
```powershell
netstat -ano | findstr :5000
```

You should see:
```
TCP    0.0.0.0:5000           0.0.0.0:0              LISTENING       <PID>
```

## Step 2: Test Backend Directly

Open browser and go to:
```
http://localhost:5000/api/books/test
```

**Expected:** `{"error":"Access token required"}`
**If you see:** "This site can't be reached" → Backend is NOT running

## Step 3: Check Browser Console

1. Open your app in browser (http://localhost:5173)
2. Press F12 → Console tab
3. Try adding a book
4. Look for error messages

**Common errors:**
- `ERR_CONNECTION_REFUSED` → Backend not running
- `CORS policy` → CORS issue (should be fixed now)
- `Failed to fetch` → Network error

## Step 4: Check Network Tab

1. Press F12 → Network tab
2. Try adding a book
3. Look for the request to `http://localhost:5000/api/books`
4. Click on it to see:
   - Status code
   - Response
   - Headers
   - Error details

## Step 5: Check Server Console

Look at the terminal where you ran `npm run server`

**You should see:**
```
Connected to MongoDB: mongodb://localhost:27017/readwise_litbot
Server running on port 5000
POST /api/books - Origin: http://localhost:5173
```

**If you see errors:**
- MongoDB connection error → Start MongoDB
- Port already in use → Kill process on port 5000

## Step 6: Verify Authentication

Make sure you're logged in:
1. Check browser localStorage (F12 → Application → Local Storage)
2. Should have:
   - `authToken` (JWT token)
   - `user` (user object with id)

**If missing:**
- Register/Login first
- Then try adding a book

## Step 7: Restart Everything

1. **Stop backend:** Press Ctrl+C in server terminal
2. **Stop frontend:** Press Ctrl+C in frontend terminal
3. **Start backend:** `npm run server`
4. **Start frontend:** `npm run dev` (in new terminal)
5. **Clear browser cache:** Ctrl+Shift+R
6. **Try again**

## Common Fixes

### Fix 1: Backend Not Running
```bash
npm run server
```

### Fix 2: MongoDB Not Running
**Windows:**
```cmd
net start MongoDB
```

### Fix 3: Port Already in Use
```powershell
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Fix 4: Clear Browser Cache
- Press Ctrl+Shift+R (hard refresh)
- Or clear browser cache completely

### Fix 5: Check .env File
Make sure `.env` exists with:
```
MONGODB_URI=mongodb://localhost:27017/
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## Still Not Working?

1. Check server terminal for error messages
2. Check browser console (F12) for detailed errors
3. Check Network tab to see the actual request/response
4. Make sure you're logged in (check localStorage)
5. Try accessing backend directly: http://localhost:5000/api/books/test

