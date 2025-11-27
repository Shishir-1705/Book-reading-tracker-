# PowerShell script to start the backend server
# Run this script to start the server

Write-Host "Starting Backend Server..." -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
MONGODB_URI=mongodb://localhost:27017/
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here_change_in_production
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host ".env file created!" -ForegroundColor Green
}

# Check if MongoDB is accessible
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
try {
    $mongodbTest = mongosh --eval "db.adminCommand('ping')" --quiet 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "MongoDB is running!" -ForegroundColor Green
    } else {
        Write-Host "Warning: MongoDB might not be running. The server will try to connect anyway." -ForegroundColor Yellow
        Write-Host "If you see connection errors, start MongoDB first:" -ForegroundColor Yellow
        Write-Host "  Windows: net start MongoDB (as Administrator)" -ForegroundColor Cyan
        Write-Host "  Or check Services for MongoDB service" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Warning: Could not check MongoDB. Make sure MongoDB is installed." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting server on port 5000..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

# Start the server
node server.cjs

