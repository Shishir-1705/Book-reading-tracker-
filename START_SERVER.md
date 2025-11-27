# How to Start the Server

## Quick Start

The backend server is now running! Here's what happened:

1. ✅ Created `.env` file with MongoDB connection settings
2. ✅ Started backend server on port 5000

## Current Status

- **Backend Server**: Running on `http://localhost:5000`
- **Frontend**: Should be running on `http://localhost:5173` (start with `npm run dev`)

## To Start Everything Again (After Restart)

### 1. Start Backend Server

Open a terminal and run:
```bash
npm run server
```

You should see:
```
Connected to MongoDB: mongodb://localhost:27017/readwise_litbot
Server running on port 5000
```

### 2. Start Frontend (in a separate terminal)

```bash
npm run dev
```

### 3. Open Browser

Go to: `http://localhost:5173`

## Troubleshooting

### If you see "MongoDB connection error"

MongoDB is not running. Start it:

**Windows:**
- Open Services (Win+R, type `services.msc`)
- Find "MongoDB" service
- Right-click → Start

Or in Command Prompt (as Administrator):
```cmd
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
```

### If port 5000 is already in use

Change the port in `.env`:
```env
PORT=5001
```

Then update frontend API calls or use a proxy.

### To Stop the Server

Press `Ctrl+C` in the terminal where the server is running.

## Verify Server is Running

Test in browser or terminal:
```bash
# Should return JSON (even if it's an error about authentication)
curl http://localhost:5000/api/books/test
```

Or open in browser: `http://localhost:5000/api/books/test`

