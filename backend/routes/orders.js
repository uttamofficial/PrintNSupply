const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent for Stripe
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise/cents
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new order
router.post('/create', async (req, res) => {
  try {
    const {
      userId,
      items,
      shippingAddress,
      subtotal,
      shipping,
      total,
      paymentMethod,
      stripePaymentIntentId,
    } = req.body;

    // Supabase automatically handles JSONB, no need to stringify
    const orderData = {
      user_id: userId,
      items: items, // Supabase will convert to JSONB
      shipping_address: shippingAddress, // Supabase will convert to JSONB
      subtotal: parseFloat(subtotal),
      shipping: parseFloat(shipping),
      total: parseFloat(total),
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      order_status: 'Pending',
      stripe_payment_intent_id: stripePaymentIntentId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Creating order with data:', orderData);

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Order created successfully:', data[0]);

    res.json({
      success: true,
      order: data[0],
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.details || 'No additional details',
      hint: error.hint || 'Check if orders table exists in Supabase'
    });
  }
});

// Get orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Supabase automatically parses JSONB, convert snake_case to camelCase
    const orders = data.map(order => ({
      id: order.id,
      userId: order.user_id,
      items: order.items, // Already parsed by Supabase
      shippingAddress: order.shipping_address, // Already parsed by Supabase
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: order.payment_method, // Convert to camelCase
      paymentStatus: order.payment_status, // Convert to camelCase
      orderStatus: order.order_status, // Convert to camelCase
      stripePaymentIntentId: order.stripe_payment_intent_id,
      createdAt: order.created_at, // Convert to camelCase
      updatedAt: order.updated_at, // Convert to camelCase
    }));

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      throw error;
    }

    // Supabase automatically parses JSONB, convert snake_case to camelCase
    const order = {
      id: data.id,
      userId: data.user_id,
      items: data.items, // Already parsed
      shippingAddress: data.shipping_address, // Already parsed
      subtotal: data.subtotal,
      shipping: data.shipping,
      total: data.total,
      paymentMethod: data.payment_method, // Convert to camelCase
      paymentStatus: data.payment_status, // Convert to camelCase
      orderStatus: data.order_status, // Convert to camelCase
      stripePaymentIntentId: data.stripe_payment_intent_id,
      createdAt: data.created_at, // Convert to camelCase
      updatedAt: data.updated_at, // Convert to camelCase
    };

    res.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const updateData = {
      updated_at: new Date().toISOString(),
    };

    if (orderStatus) updateData.order_status = orderStatus;
    if (paymentStatus) updateData.payment_status = paymentStatus;

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      order: data[0],
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
