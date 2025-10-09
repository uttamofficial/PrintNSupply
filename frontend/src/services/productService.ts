import { supabase } from '../config/supabase';
import { Product } from '../types';
import { products as mockProducts } from '../data/products';

export const productService = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.warn('Failed to fetch products from Supabase, using mock data:', error.message);
        return mockProducts;
      }
      
      // If we get data, return it
      if (data && data.length > 0) {
        return data;
      }
      
      // If no data but no error, return mock data as fallback
      console.warn('No products found in Supabase, using mock data');
      return mockProducts;
    } catch (error) {
      console.error('Error fetching products, using mock data:', error);
      return mockProducts;
    }
  },

  // Get product by ID
  async getProductById(id: number): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.warn('Failed to fetch product from Supabase:', error.message);
        // Try to find in mock data as fallback
        return mockProducts.find(product => product.id === id) || null;
      }
      
      return data || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      // Try to find in mock data as fallback
      return mockProducts.find(product => product.id === id) || null;
    }
  },

  // Create a new product
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data[0];
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update a product
  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.length === 0) {
        throw new Error('Product not found');
      }
      
      return data[0];
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete a product
  async deleteProduct(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};