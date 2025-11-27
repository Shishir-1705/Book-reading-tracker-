# How to Run the Project

## Current Status

✅ **Backend Server**: Running on port 5000
🔄 **Frontend**: Starting...

## Running the Project

### Method 1: Run Both Separately (Recommended)

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Method 2: Using PowerShell Script

**Start Backend:**
```powershell
.\start-server.ps1
```

**Start Frontend (in another terminal):**
```bash
npm run dev
```

## Verify Everything is Running

### Check Backend (Port 5000)
Open browser: `http://localhost:5000/api/books/test`

Should see: `{"error":"Access token required"}` ✅

### Check Frontend (Port 5173)
Open browser: `http://localhost:5173`

Should see: Your React app ✅

## What You Should See

### Backend Terminal:
```
Connected to MongoDB: mongodb://localhost:27017/readwise_litbot
Server running on port 5000
GET /api/books/...
```

### Frontend Terminal:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Troubleshooting

### Frontend won't start
- Make sure port 5173 is not in use
- Check if dependencies are installed: `npm install`
- Look for error messages in terminal

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists
- Check port 5000 is not in use

### Can't connect to backend from frontend
- Make sure backend is running on port 5000
- Check CORS settings in `server.cjs`
- Verify `FRONTEND_URL` in `.env` matches frontend URL

## Quick Test

1. Open `http://localhost:5173` in browser
2. Register/Login
3. Try adding a book
4. Should work without errors!

