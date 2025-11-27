# MongoDB Setup and Connection Guide

## Overview
This guide explains how to connect the React + Node/Express app to MongoDB and fix connection issues.

## Changes Made

### 1. MongoDB Connection Configuration

**File: `server.cjs`**
- Updated to use `MONGODB_URI` environment variable instead of hardcoded connection string
- Added automatic database name appending if not specified in URI
- Added proper error handling with process exit on connection failure

**File: `src/integrations/mongodb/client.ts`**
- Fixed to use `process.env.MONGODB_URI` for backend (Node.js) instead of `import.meta.env` (which is for frontend/Vite)
- Added fallback logic to handle both backend and frontend environments
- Automatically appends database name if not present in connection string

### 2. CORS Configuration

**File: `server.ts`**
- Enhanced CORS configuration with explicit origin and credentials support
- Uses `FRONTEND_URL` environment variable or defaults to `http://localhost:5173`

### 3. Frontend Error Handling

**File: `src/components/BookLibrary.tsx`**
- Improved error messages to show actual API error responses
- Better handling of failed progress fetches (non-blocking)
- Added proper error logging for debugging

**File: `src/components/AddBookForm.tsx`**
- Enhanced error handling to display actual API error messages
- Better error parsing from API responses

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a `.env` file in the root directory:

```env
# MongoDB Connection String
# Format: mongodb://localhost:27017/database_name
# If you provide just mongodb://localhost:27017/, the code will append /readwise_litbot
MONGODB_URI=mongodb://localhost:27017/

# Server Port (optional, defaults to 5000)
PORT=5000

# Frontend URL for CORS (optional, defaults to http://localhost:5173)
FRONTEND_URL=http://localhost:5173

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

### 3. Start MongoDB

Make sure MongoDB is running on your local machine:

```bash
# On Windows (if installed as service, it should start automatically)
# Or start manually:
mongod

# On macOS/Linux:
sudo systemctl start mongod
# or
mongod
```

### 4. Start the Backend Server

```bash
# Using CommonJS server (recommended - has authentication)
npm run server

# Or using TypeScript server
npm run server:ts

# Or with auto-reload (requires nodemon: npm install -g nodemon)
npm run server:dev
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

### 5. Start the Frontend

In a separate terminal:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or the next available port).

## Testing

### Test Plan

1. **MongoDB Connection Test**
   - Start MongoDB
   - Start backend server
   - Check console for "Connected to MongoDB" message
   - Verify no connection errors

2. **Backend API Test**
   - Open browser to `http://localhost:5000/api/books/test-user-id` (will fail without auth, but should return JSON error)
   - Or use Postman/curl to test endpoints

3. **Frontend Connection Test**
   - Start both backend and frontend
   - Open browser to `http://localhost:5173`
   - Register/Login a user
   - Try to view the book library
   - Should see books list (empty if no books added yet)

4. **Add Book Test**
   - Click "Add Book" button
   - Fill in book details
   - Submit form
   - Verify book appears in library

5. **Error Handling Test**
   - Stop MongoDB server
   - Try to fetch books
   - Should see meaningful error message

## Troubleshooting

### "Failed to fetch" Error

**Possible causes:**
1. Backend server not running - Start with `npm run server`
2. MongoDB not running - Start MongoDB service
3. CORS issues - Check that `FRONTEND_URL` in `.env` matches your frontend URL
4. Wrong port - Verify backend is on port 5000 (or check `.env`)

### "MongoDB connection error"

**Possible causes:**
1. MongoDB not installed or not running
2. Wrong connection string in `.env`
3. Firewall blocking port 27017
4. MongoDB service not started

### "Failed to load books"

**Possible causes:**
1. User not authenticated - Make sure you're logged in
2. Backend API error - Check backend console for errors
3. Network error - Check browser console for details

## API Endpoints

The backend provides these endpoints (all require authentication except auth endpoints):

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/books/:userId` - Get books for user
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/reading-progress/:userId` - Get reading progress
- `POST /api/reading-progress` - Create reading progress
- `PUT /api/reading-progress/:id` - Update reading progress

## Code Changes Summary

### Backend Changes

1. **server.cjs**: Uses `MONGODB_URI` env var, handles database name appending
2. **server.ts**: Enhanced CORS, better error handling
3. **client.ts**: Fixed to use `process.env` for backend

### Frontend Changes

1. **BookLibrary.tsx**: Better error messages, non-blocking progress fetch
2. **AddBookForm.tsx**: Improved error handling

## Notes

- The connection string `mongodb://localhost:27017/` will automatically use database `readwise_litbot`
- If you provide a full connection string with database name, it will be used as-is
- All API endpoints require JWT authentication (Bearer token)
- CORS is configured to allow requests from the frontend URL

