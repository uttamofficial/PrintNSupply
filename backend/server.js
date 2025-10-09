const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS with specific origins
const corsOptions = {
  origin: [
    'http://localhost:5173', // Local development
    'http://localhost:3000', // Alternative local port
    'https://printnsupply.onrender.com', // Production frontend URL
    'https://printnsupply-frontend.onrender.com', // Alternative frontend URL pattern
    process.env.FRONTEND_URL // Environment variable for frontend URL
  ].filter(Boolean), // Remove any undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increase payload limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Import routes
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const orderRoutes = require('./routes/orders');
const cloudinaryRoutes = require('./routes/cloudinary');

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

// Add stationery endpoints
app.get('/stationery', async (req, res) => {
  try {
    const mockProducts = require('./data/products');
    // Filter products that might be stationery-related
    const stationeryProducts = mockProducts.filter(product => 
      product.category && (
        product.category.toLowerCase().includes('stationery') ||
        product.category.toLowerCase().includes('supplies') ||
        product.category.toLowerCase().includes('office') ||
        product.name.toLowerCase().includes('pen') ||
        product.name.toLowerCase().includes('notebook') ||
        product.name.toLowerCase().includes('paper')
      )
    );
    res.json(stationeryProducts.length > 0 ? stationeryProducts : mockProducts);
  } catch (error) {
    console.error('Error fetching stationery products:', error);
    res.status(500).json({ error: 'Failed to fetch stationery products' });
  }
});

// Add API stationery endpoint as well
app.get('/api/stationery', async (req, res) => {
  try {
    const mockProducts = require('./data/products');
    // Filter products that might be stationery-related
    const stationeryProducts = mockProducts.filter(product => 
      product.category && (
        product.category.toLowerCase().includes('stationery') ||
        product.category.toLowerCase().includes('supplies') ||
        product.category.toLowerCase().includes('office') ||
        product.name.toLowerCase().includes('pen') ||
        product.name.toLowerCase().includes('notebook') ||
        product.name.toLowerCase().includes('paper')
      )
    );
    res.json(stationeryProducts.length > 0 ? stationeryProducts : mockProducts);
  } catch (error) {
    console.error('Error fetching stationery products:', error);
    res.status(500).json({ error: 'Failed to fetch stationery products' });
  }
});

// API routes that don't exist
app.get('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found', 
    path: req.path,
    message: 'Please check the API documentation for available endpoints'
  });
});

// For production, serve the React app
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Frontend URL: https://printnsupply.onrender.com`);
  console.log(`🔧 Backend URL: https://printnsupply-backend.onrender.com`);
  console.log(`📡 CORS enabled for frontend communication`);
});