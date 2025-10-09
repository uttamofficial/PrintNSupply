const { supabase } = require('../config/supabase');
const products = require('../data/products');

async function seedDatabase() {
  console.log('Seeding database with initial products...');
  
  try {
    // First, delete all existing products
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0); // Delete all rows
    
    if (deleteError) {
      console.error('Error deleting existing products:', deleteError);
    } else {
      console.log('Existing products cleared successfully!');
    }
    
    // Insert products into the database
    const { data, error } = await supabase
      .from('products')
      .insert(products);
    
    if (error) {
      console.error('Error seeding database:', error);
      return;
    }
    
    console.log('Database seeded successfully!');
    console.log(`Inserted ${products.length} products`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seedDatabase();