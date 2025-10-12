const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { verifyAdminToken } = require('./adminAuth');

// Get all products with pagination
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    // Check if we want all products (for admin panel)
    const getAll = req.query.all === 'true';
    
    if (getAll) {
      // Get all products without pagination
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      res.json({
        products: data,
        pagination: {
          page: 1,
          limit: data.length,
          total: count,
          totalPages: 1
        }
      });
    } else {
      // Use pagination as before
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Get products from Supabase
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      res.json({
        products: data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products: ' + error.message });
  }
});

// Get product by ID
router.get('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create a new product
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    // Get the maximum ID to avoid conflicts
    const { data: maxData, error: maxError } = await supabase
      .from('products')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    let nextId = 1;
    if (!maxError && maxData) {
      nextId = maxData.id + 1;
    }

    const newProduct = {
      id: nextId, // Explicitly set the ID to avoid conflicts
      name,
      description: description || '',
      price: parseFloat(price),
      category: category || '',
      image: image || '',
      created_at: new Date().toISOString()
    };

    console.log('Inserting product with explicit ID:', newProduct);

    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product: ' + error.message });
  }
});

// Update a product
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image } = req.body;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    // First check if product exists
    const { data: existingProduct, error: findError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (findError) {
      console.error('Error finding product:', findError);
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = {
      name,
      description: description || '',
      price: parseFloat(price),
      category: category || '',
      image: image || ''
      // Remove updated_at since it doesn't exist in the current schema
    };

    // Update the product
    const { data, error: updateError } = await supabase
      .from('products')
      .update(updatedProduct)
      .eq('id', id)
      .select();

    if (updateError) {
      throw updateError;
    }

    // Return the updated product
    res.json(data[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product: ' + error.message });
  }
});

// Delete a product
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    // First check if product exists
    const { data: existingProduct, error: findError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (findError) {
      console.error('Error finding product:', findError);
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete the product
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product: ' + error.message });
  }
});

// Get product statistics
router.get('/stats/overview', verifyAdminToken, async (req, res) => {
  try {
    // Get total products count
    const { count: totalProducts, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    res.json({
      totalProducts
    });
  } catch (error) {
    console.error('Error fetching product stats:', error);
    res.status(500).json({ error: 'Failed to fetch product statistics' });
  }
});

module.exports = router;