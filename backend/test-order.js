const { supabase } = require('./config/supabase');

async function testOrderCreation() {
  console.log('🧪 Testing order creation...\n');

  const testOrder = {
    user_id: 'test_user_123',
    items: [
      {
        id: 1,
        name: 'Test Product',
        price: 100,
        quantity: 1,
        image: 'https://example.com/image.jpg'
      }
    ],
    shipping_address: {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      address: '123 Test St',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    subtotal: 100,
    shipping: 50,
    total: 150,
    payment_method: 'COD',
    payment_status: 'Pending',
    order_status: 'Pending',
    stripe_payment_intent_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log('📦 Test order data:', JSON.stringify(testOrder, null, 2));
  console.log('\n🔄 Attempting to insert...\n');

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([testOrder])
      .select();

    if (error) {
      console.log('❌ ERROR OCCURRED:');
      console.log('Message:', error.message);
      console.log('Details:', error.details);
      console.log('Hint:', error.hint);
      console.log('Code:', error.code);
      console.log('\nFull error:', error);
      process.exit(1);
    }

    console.log('✅ SUCCESS! Order created:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n🎉 Your payment system should work now!');
    console.log('Go test it at: http://localhost:5174/stationery\n');
    process.exit(0);

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    console.log(error);
    process.exit(1);
  }
}

testOrderCreation();
