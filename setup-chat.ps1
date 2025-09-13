Write-Host "Gram Panchayat Intelligent Chat System Setup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Setting up environment configuration..." -ForegroundColor Yellow

# Check if .env file exists in backend
$envPath = "backend\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" $envPath
    Write-Host ".env file created" -ForegroundColor Green
} else {
    Write-Host ".env file already exists" -ForegroundColor Green
}

# Prompt for Gemini API key
Write-Host ""
Write-Host "Gemini API Key Configuration" -ForegroundColor Magenta
Write-Host "To get your free Gemini API key:" -ForegroundColor Yellow
Write-Host "1. Go to: https://makersuite.google.com/app/apikey" -ForegroundColor Yellow
Write-Host "2. Click 'Create API Key'" -ForegroundColor Yellow
Write-Host "3. Copy your API key" -ForegroundColor Yellow
Write-Host ""

$geminiKey = Read-Host "Please enter your Gemini API key"

if ($geminiKey -and $geminiKey.Length -gt 0) {
    # Update the .env file with the API key
    $envContent = Get-Content $envPath
    $envContent = $envContent -replace "GEMINI_API_KEY=your_free_gemini_api_key_here", "GEMINI_API_KEY=$geminiKey"
    Set-Content $envPath $envContent
    Write-Host "Gemini API key configured successfully" -ForegroundColor Green
} else {
    Write-Host "No API key provided. You can add it manually to backend\.env later" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Blue
Set-Location backend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host ""
Write-Host "Starting the intelligent chat system..." -ForegroundColor Green
Write-Host ""

# Start the backend server
Write-Host "Starting backend server..." -ForegroundColor Blue
Write-Host "Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Chat interface will be available at: file:///$(Get-Location)\intelligent-chat.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location backend
npm start
