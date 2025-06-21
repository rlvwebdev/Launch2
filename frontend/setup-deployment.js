#!/usr/bin/env node

/**
 * Launch TMS Deployment Setup Script
 * Automates the deployment and database setup process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Launch TMS Deployment Setup\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the frontend directory');
  process.exit(1);
}

// Check for required files
const requiredFiles = [
  'src/app/api/drivers/route.ts',
  'src/app/api/trucks/route.ts', 
  'src/app/api/init-db/route.ts',
  'src/lib/database.ts'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error('❌ Missing required files:');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  process.exit(1);
}

async function runSetup() {
  try {
    console.log('1️⃣ Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    console.log('\n2️⃣ Building project...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('\n3️⃣ Deploying to Vercel...');
    execSync('vercel --prod', { stdio: 'inherit' });

    console.log('\n✅ Deployment completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Create a Vercel Postgres database:');
    console.log('   - Go to vercel.com/dashboard');
    console.log('   - Select your project');
    console.log('   - Go to Storage → Create Database → Postgres');
    console.log('   - Name it "launch-tms-db"');
    console.log('');
    console.log('2. Add environment variables to Vercel:');
    console.log('   - Copy the POSTGRES_* variables from the database');
    console.log('   - Add them to Settings → Environment Variables');
    console.log('   - Redeploy your project');
    console.log('');
    console.log('3. Initialize your database:');
    console.log('   - Visit your deployed app');
    console.log('   - Go to /database-setup');
    console.log('   - Click "Initialize Database"');
    console.log('');
    console.log('4. Test your application:');
    console.log('   - Check /drivers and /trucks pages');
    console.log('   - Verify data is loading from the database');
    console.log('');
    console.log('🎉 Your Launch TMS is ready for production!');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Manual steps:');
    console.log('1. npm install');
    console.log('2. npm run build');
    console.log('3. vercel --prod');
    console.log('4. Set up database (see README-DEPLOYMENT.md)');
    process.exit(1);
  }
}

runSetup();
