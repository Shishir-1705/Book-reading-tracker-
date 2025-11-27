# Troubleshooting Guide

## "Failed to fetch" Error

If you're seeing "Failed to fetch" or "Cannot connect to server" errors, follow these steps:

### Step 1: Verify Backend Server is Running

1. Open a terminal/command prompt
2. Navigate to your project directory
3. Run: `npm run server`
4. You should see:
   ```
   Connected to MongoDB: mongodb://localhost:27017/readwise_litbot
   Server running on port 5000
   ```

**If you see MongoDB connection errors:**
- Make sure MongoDB is installed and running
- On Windows: Check if MongoDB service is running in Services
- On Mac/Linux: Run `sudo systemctl start mongod` or `mongod`

### Step 2: Verify MongoDB is Running

1. Open a new terminal
2. Run: `mongosh` or `mongo` (depending on your MongoDB version)
3. If it connects, MongoDB is running
4. Type `exit` to leave

**If MongoDB won't start:**
- Check if port 27017 is already in use
- Verify MongoDB is installed correctly
- Check MongoDB logs for errors

### Step 3: Check Environment Variables

Create a `.env` file in the root directory with:

```env
MONGODB_URI=mongodb://localhost:27017/
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

### Step 4: Verify Ports

- Backend should be on port **5000**
- Frontend should be on port **5173** (or next available)
- MongoDB should be on port **27017**

Check if ports are in use:
- Windows: `netstat -ano | findstr :5000`
- Mac/Linux: `lsof -i :5000`

### Step 5: Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Go to Network tab
5. Try the action again
6. Check if the request to `http://localhost:5000/api/books` appears
7. Click on it to see the error details

### Step 6: Test Backend Directly

Open a new terminal and test the API:

**Windows PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/books/test" -Method GET
```

**Mac/Linux/Windows (with curl):**
```bash
curl http://localhost:5000/api/books/test
```

You should get a JSON response (even if it's an error about authentication).

### Common Issues and Solutions

#### Issue: "Cannot connect to server"
**Solution**: Backend server is not running. Start it with `npm run server`

#### Issue: "MongoDB connection error"
**Solution**: 
- MongoDB is not running
- Wrong connection string in `.env`
- Firewall blocking port 27017

#### Issue: "CORS error" in browser console
**Solution**: 
- Check `FRONTEND_URL` in `.env` matches your frontend URL
- Make sure CORS is enabled in `server.cjs`

#### Issue: "401 Unauthorized" or "403 Forbidden"
**Solution**: 
- You're not logged in
- Token expired - try logging in again
- Check if JWT_SECRET matches

#### Issue: "500 Internal Server Error"
**Solution**: 
- Check backend console for error details
- Verify MongoDB connection
- Check if all required fields are provided

### Quick Diagnostic Commands

```bash
# Check if Node.js is installed
node --version

# Check if npm is installed
npm --version

# Check if MongoDB is running (Windows)
sc query MongoDB

# Check if MongoDB is running (Mac/Linux)
sudo systemctl status mongod

# Test MongoDB connection
mongosh --eval "db.adminCommand('ping')"
```

### Still Having Issues?

1. Check the backend server console for error messages
2. Check browser console (F12) for frontend errors
3. Verify all dependencies are installed: `npm install`
4. Make sure you're using the correct server file (`server.cjs` not `server.ts`)
5. Try restarting both backend and frontend servers
6. Clear browser cache and localStorage
7. Check if antivirus/firewall is blocking connections

