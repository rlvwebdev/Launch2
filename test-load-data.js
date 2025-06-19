// Test script to verify comprehensive data loading
const fs = require('fs');
const path = require('path');

// Check if the comprehensive data file exists and is readable
const publicDataPath = path.join(__dirname, 'public', 'comprehensive_loads_data.json');
const scriptsDataPath = path.join(__dirname, 'scripts', 'comprehensive_loads_data.json');

console.log('Testing comprehensive data file access...');

// Test public folder
if (fs.existsSync(publicDataPath)) {
  console.log('✓ Public comprehensive data file exists');
  try {
    const publicData = JSON.parse(fs.readFileSync(publicDataPath, 'utf8'));
    console.log(`✓ Public data loaded: ${publicData.length} loads`);
    
    // Sample a few loads to check structure
    if (publicData.length > 0) {
      const sample = publicData[0];
      console.log('Sample load structure:', {
        id: sample.id,
        shipper: sample.shipper,
        status: sample.status,
        pickupDate: sample.pickupDate
      });
    }
  } catch (error) {
    console.error('✗ Error reading public data:', error.message);
  }
} else {
  console.log('✗ Public comprehensive data file not found');
}

// Test scripts folder
if (fs.existsSync(scriptsDataPath)) {
  console.log('✓ Scripts comprehensive data file exists');
  try {
    const scriptsData = JSON.parse(fs.readFileSync(scriptsDataPath, 'utf8'));
    console.log(`✓ Scripts data loaded: ${scriptsData.length} loads`);
  } catch (error) {
    console.error('✗ Error reading scripts data:', error.message);
  }
} else {
  console.log('✗ Scripts comprehensive data file not found');
}
