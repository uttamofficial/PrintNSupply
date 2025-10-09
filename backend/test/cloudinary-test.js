const cloudinary = require('../config/cloudinary');

async function testCloudinary() {
  try {
    console.log('Testing Cloudinary configuration...');
    
    // Test configuration
    const config = cloudinary.config();
    console.log('Cloudinary config:', {
      cloud_name: config.cloud_name,
      api_key: config.api_key ? '***' + config.api_key.slice(-4) : 'Not set'
    });
    
    // Test upload
    console.log('Testing upload...');
    const result = await cloudinary.uploader.upload(
      'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800',
      {
        folder: 'test',
        public_id: 'test_image'
      }
    );
    
    console.log('Upload successful:', {
      url: result.secure_url,
      public_id: result.public_id
    });
    
    // Test delete
    console.log('Testing delete...');
    const deleteResult = await cloudinary.uploader.destroy('test/test_image');
    console.log('Delete result:', deleteResult);
    
    console.log('Cloudinary integration test completed successfully!');
  } catch (error) {
    console.error('Cloudinary test failed:', error);
  }
}

testCloudinary();