# Fix "Cannot connect to server" Error

## Quick Fix Steps

### Step 1: Start MongoDB

**Windows:**
1. Open Command Prompt as Administrator (Right-click → Run as Administrator)
2. Run: `net start MongoDB`

OR

1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find "MongoDB" in the list
4. Right-click → Start

**If MongoDB is not installed:**
- Download from: https://www.mongodb.com/try/download/community
- Install it, then start the service

### Step 2: Start Backend Server

**Option A: Using PowerShell Script (Easiest)**
```powershell
.\start-server.ps1
```

**Option B: Using npm script**
```bash
npm run server
```

**Option C: Direct command**
```bash
node server.cjs
```

You should see:
```
Connected to MongoDB: mongodb://localhost:27017/readwise_litbot
Server running on port 5000
```

### Step 3: Verify Server is Running

Open a new terminal and test:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/books/test" -UseBasicParsing
```

You should get a response (even if it's an error about authentication).

### Step 4: Refresh Your Browser

1. Go to `http://localhost:5173`
2. Refresh the page (F5)
3. Try adding a book again

## Common Issues

### Issue: "MongoDB connection error"

**Solution:** MongoDB is not running
- Start MongoDB service (see Step 1)
- Or install MongoDB if not installed

### Issue: "Port 5000 already in use"

**Solution:** Another process is using port 5000
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F
```

### Issue: "Cannot find module"

**Solution:** Dependencies not installed
```bash
npm install
```

### Issue: Server starts but still can't connect

**Check:**
1. Is the server actually running? Look for "Server running on port 5000" message
2. Check browser console (F12) for CORS errors
3. Make sure `.env` file exists with correct settings
4. Try accessing `http://localhost:5000/api/books/test` directly in browser

## Verify Everything is Working

1. ✅ MongoDB service is running
2. ✅ Backend server shows "Connected to MongoDB" and "Server running on port 5000"
3. ✅ Frontend is running on `http://localhost:5173`
4. ✅ Browser can access `http://localhost:5000/api/books/test` (shows JSON error, not "Failed to fetch")

## Still Not Working?

1. Check the terminal where server is running for error messages
2. Check browser console (F12) for detailed errors
3. Make sure firewall isn't blocking port 5000
4. Try restarting your computer (sometimes helps with service issues)

