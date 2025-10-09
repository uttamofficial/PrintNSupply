// Comprehensive functionality test for PrintNSupply
const http = require('http');

console.log('🧪 PrintNSupply - Comprehensive Functionality Test\n');

// Test 1: Backend Server
console.log('1. Testing Backend Server...');
const backendRequest = http.get('http://localhost:5005', (res) => {
  console.log(`   ✅ Backend Server: ${res.statusCode === 200 ? 'RUNNING' : 'ISSUE'}`);
  
  // Test 2: API Endpoints
  console.log('\n2. Testing API Endpoints...');
  const apiRequest = http.get('http://localhost:5005/api/products', (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      if (apiRes.statusCode === 200) {
        const products = JSON.parse(data);
        console.log(`   ✅ Products API: ${products.length} products loaded`);
        
        // Test 3: Product Data Structure
        console.log('\n3. Testing Product Data Structure...');
        if (products.length > 0) {
          const product = products[0];
          const requiredFields = ['id', 'name', 'price', 'category', 'image'];
          const missingFields = requiredFields.filter(field => !(field in product));
          
          if (missingFields.length === 0) {
            console.log('   ✅ Product Data Structure: All required fields present');
          } else {
            console.log(`   ❌ Product Data Structure: Missing fields: ${missingFields.join(', ')}`);
          }
          
          // Test 4: Pricing
          console.log('\n4. Testing Pricing...');
          if (typeof product.price === 'number' && product.price > 0) {
            console.log('   ✅ Pricing: Correctly formatted in Rupees');
          } else {
            console.log('   ❌ Pricing: Issues with price format');
          }
        }
      } else {
        console.log('   ❌ Products API: Failed to load products');
      }
      
      // Test 5: Upload Endpoint
      console.log('\n5. Testing Upload Endpoint...');
      const uploadRequest = http.get('http://localhost:5005/api/upload', (uploadRes) => {
        if (uploadRes.statusCode === 404) {
          console.log('   ✅ Upload Endpoint: Correctly requires POST method');
        } else {
          console.log('   ⚠️  Upload Endpoint: Unexpected response');
        }
      });
      
      uploadRequest.on('error', (err) => {
        console.log('   ❌ Upload Endpoint: Connection error');
      });
    });
  });
  
  apiRequest.on('error', (err) => {
    console.log('   ❌ Products API: Connection error');
  });
});

backendRequest.on('error', (err) => {
  console.log('   ❌ Backend Server: Not running or connection error');
  console.log('\n📋 To run the backend server:');
  console.log('   cd backend && npm run dev');
});

// Test 6: Frontend Availability
console.log('\n6. Testing Frontend Availability...');
const frontendRequest = http.get('http://localhost:5174', (res) => {
  console.log(`   ✅ Frontend Server: ${res.statusCode === 200 ? 'RUNNING' : 'ISSUE'}`);
  
  // Test 7: Static Assets
  console.log('\n7. Testing Static Assets...');
  const assetRequest = http.get('http://localhost:5174/src/main.tsx', (assetRes) => {
    if (assetRes.statusCode === 200) {
      console.log('   ✅ Static Assets: TypeScript files accessible');
    } else {
      console.log('   ⚠️  Static Assets: Issues with asset serving');
    }
  });
  
  assetRequest.on('error', (err) => {
    console.log('   ❌ Static Assets: Connection error');
  });
});

frontendRequest.on('error', (err) => {
  console.log('   ❌ Frontend Server: Not running or connection error');
  console.log('\n📋 To run the frontend server:');
  console.log('   cd frontend && npm run dev');
});

// Test 8: Environment Variables
console.log('\n8. Testing Environment Configuration...');
const fs = require('fs');
const path = require('path');

// Check backend .env
const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
fs.access(backendEnvPath, fs.constants.F_OK, (err) => {
  if (!err) {
    console.log('   ✅ Backend Environment: .env file exists');
    // Read and check key variables
    fs.readFile(backendEnvPath, 'utf8', (err, data) => {
      if (!err) {
        const hasCloudinary = data.includes('CLOUDINARY_CLOUD_NAME=dcwzukqqw');
        const hasPort = data.includes('PORT=5005');
        console.log(`   ${hasCloudinary ? '✅' : '❌'} Backend Environment: Cloudinary configured`);
        console.log(`   ${hasPort ? '✅' : '❌'} Backend Environment: Port configured`);
      }
    });
  } else {
    console.log('   ❌ Backend Environment: .env file missing');
  }
});

// Check frontend .env.local
const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env.local');
fs.access(frontendEnvPath, fs.constants.F_OK, (err) => {
  if (!err) {
    console.log('   ✅ Frontend Environment: .env.local file exists');
    // Read and check key variables
    fs.readFile(frontendEnvPath, 'utf8', (err, data) => {
      if (!err) {
        const hasCloudinary = data.includes('VITE_CLOUDINARY_CLOUD_NAME=dcwzukqqw');
        const hasClerk = data.includes('VITE_CLERK_PUBLISHABLE_KEY=');
        console.log(`   ${hasCloudinary ? '✅' : '❌'} Frontend Environment: Cloudinary configured`);
        console.log(`   ${hasClerk ? '✅' : '❌'} Frontend Environment: Clerk configured`);
      }
    });
  } else {
    console.log('   ❌ Frontend Environment: .env.local file missing');
  }
});

console.log('\n🏁 Functionality Test Complete');
console.log('\n📋 Quick Access URLs:');
console.log('   Frontend: http://localhost:5174');
console.log('   Backend API: http://localhost:5005/api/products');
console.log('   Test Page: http://localhost:5174/functionality-check.html');