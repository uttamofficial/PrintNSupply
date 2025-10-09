const { supabase } = require('../config/supabase');
const fs = require('fs');
const path = require('path');

async function createOrdersTable() {
  try {
    console.log('Creating orders table...');

    // Read the SQL migration file
    const sqlFile = path.join(__dirname, '../migrations/002_create_orders_table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If RPC doesn't work, try direct SQL execution through Supabase dashboard
      console.log('Please run this SQL in your Supabase SQL Editor:');
      console.log('\n' + sql + '\n');
      console.log('Or visit: https://qlchpejqhdjzbfikvlzw.supabase.co/project/_/sql');
    } else {
      console.log('✅ Orders table created successfully!');
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nPlease manually create the orders table using the SQL in:');
    console.log('backend/migrations/002_create_orders_table.sql');
  }
}

createOrdersTable();
