# Quick Start Guide - Fix "Failed to fetch" Error

## Immediate Steps to Fix the Error

### 1. Create `.env` File

Create a file named `.env` in the root directory with this content:

```env
MONGODB_URI=mongodb://localhost:27017/
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

### 2. Start MongoDB

**Windows:**
- MongoDB should start automatically if installed as a service
- Or open Command Prompt as Administrator and run: `net start MongoDB`

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
mongod
```

### 3. Start Backend Server

Open a terminal in the project directory and run:

```bash
npm run server
```

**You should see:**
```
Connected to MongoDB: mongodb://localhost:27017/readwise_litbot
Server running on port 5000
```

**If you see errors:**
- "MongoDB connection error" → MongoDB is not running (see step 2)
- "Cannot find module" → Run `npm install` first

### 4. Start Frontend

Open a **NEW** terminal in the project directory and run:

```bash
npm run dev
```

**You should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### 5. Test the Application

1. Open browser to `http://localhost:5173`
2. Register/Login
3. Try adding a book
4. The error should be gone!

## If Error Persists

### Check Backend is Running

Open browser to: `http://localhost:5000/api/books/test`

You should see a JSON error (not "Failed to fetch"). If you see "Failed to fetch", the backend is not running.

### Check Browser Console

1. Press F12 in browser
2. Go to Console tab
3. Look for red error messages
4. Go to Network tab
5. Try adding a book again
6. Click on the failed request to see details

### Common Fixes

**Error: "Cannot connect to server"**
→ Backend server is not running. Start it with `npm run server`

**Error: "MongoDB connection error"**
→ MongoDB is not running. Start MongoDB service.

**Error: "CORS policy"**
→ Check `.env` file has correct `FRONTEND_URL`

**Error: "401 Unauthorized"**
→ You're not logged in. Register/Login first.

## Verification Checklist

- [ ] `.env` file exists with `MONGODB_URI`
- [ ] MongoDB is running (check with `mongosh`)
- [ ] Backend server shows "Connected to MongoDB" and "Server running on port 5000"
- [ ] Frontend is running on port 5173
- [ ] Browser console shows no CORS errors
- [ ] You are logged in (check localStorage for 'authToken')

## Still Not Working?

See `TROUBLESHOOTING.md` for detailed debugging steps.

