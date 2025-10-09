const { supabase } = require('./config/supabase');

async function checkOrdersTable() {
  console.log('🔍 Checking if orders table exists...\n');

  try {
    // Try to query the orders table
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        console.log('❌ ORDERS TABLE DOES NOT EXIST!\n');
        console.log('This is why your payments are failing.\n');
        console.log('═══════════════════════════════════════════════════════════════\n');
        console.log('📋 TO FIX THIS, CREATE THE TABLE IN SUPABASE:\n');
        console.log('1. Open: https://qlchpejqhdjzbfikvlzw.supabase.co/project/_/sql\n');
        console.log('2. Click "New Query"\n');
        console.log('3. Copy and paste this SQL:\n');
        console.log('═══════════════════════════════════════════════════════════════\n');
        console.log(`
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    items JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('COD', 'Online')),
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed')),
    order_status TEXT NOT NULL DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
        `);
        console.log('═══════════════════════════════════════════════════════════════\n');
        console.log('4. Click "Run" button (▶️)\n');
        console.log('5. You should see "Success. No rows returned"\n');
        console.log('6. Then try your payment again!\n');
        console.log('═══════════════════════════════════════════════════════════════\n');
      } else {
        console.log('❌ Error checking table:', error.message);
        console.log('Details:', error);
      }
      process.exit(1);
    } else {
      console.log('✅ ORDERS TABLE EXISTS!\n');
      console.log('📊 Table is working properly.');
      console.log('🎉 Your payment system should work now!\n');
      
      if (data && data.length > 0) {
        console.log(`📦 Found ${data.length} existing order(s) in the table.\n`);
      } else {
        console.log('📭 Table is empty (no orders yet).\n');
      }
      process.exit(0);
    }
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

checkOrdersTable();
