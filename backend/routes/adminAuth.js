const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock admin data for demonstration
// In production, this would be stored in a database
const admins = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@printnsupply.com',
    password: '$2b$10$hGm8BFwXtntvvx3RSZSkEuUfU5kPxH2OlPbKyaFw6CX8Jo6cYCRwq', // password: admin123
    role: 'super_admin'
  }
];

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = admins.find(a => a.email === email);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email, 
        role: admin.role 
      },
      process.env.JWT_SECRET || 'admin_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Admin register (only for development/testing)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = admins.find(a => a.email === email);
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = {
      id: admins.length + 1,
      username,
      email,
      password: hashedPassword,
      role: role || 'admin'
    };

    admins.push(newAdmin);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newAdmin.id, 
        email: newAdmin.email, 
        role: newAdmin.role 
      },
      process.env.JWT_SECRET || 'admin_secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin_secret_key');
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Get admin profile
router.get('/profile', verifyAdminToken, (req, res) => {
  const admin = admins.find(a => a.id === req.admin.id);
  if (!admin) {
    return res.status(404).json({ error: 'Admin not found' });
  }

  res.json({
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role
  });
});

module.exports = { router, verifyAdminToken };