# PowerShell script to generate comprehensive fake data
# Run this from the frontend directory

Write-Host "🚀 Starting comprehensive fake data generation..." -ForegroundColor Green

# Set environment variables for local PostgreSQL
$env:LOCAL_POSTGRES_USER = "postgres"
$env:LOCAL_POSTGRES_HOST = "localhost"
$env:LOCAL_POSTGRES_DB = "launch_tms"
$env:LOCAL_POSTGRES_PASSWORD = "postgres"
$env:LOCAL_POSTGRES_PORT = "5432"

Write-Host "📊 Environment configured for local PostgreSQL" -ForegroundColor Blue

# Run the Node.js script
Write-Host "🔄 Executing data generation script..." -ForegroundColor Yellow
node scripts/generate-comprehensive-data.js

Write-Host "✅ Data generation script completed!" -ForegroundColor Green
