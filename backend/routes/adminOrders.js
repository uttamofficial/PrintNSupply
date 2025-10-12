const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { verifyAdminToken } = require('./adminAuth');

// Get all orders with pagination and filtering
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('order_status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Format the response to match frontend expectations
    const formattedOrders = data.map(order => ({
      id: order.id,
      userId: order.user_id,
      items: order.items,
      shippingAddress: order.shipping_address,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      stripePaymentIntentId: order.stripe_payment_intent_id,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }));

    res.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Format the response to match frontend expectations
    const formattedOrder = {
      id: data.id,
      userId: data.user_id,
      items: data.items,
      shippingAddress: data.shipping_address,
      subtotal: data.subtotal,
      shipping: data.shipping,
      total: data.total,
      paymentMethod: data.payment_method,
      paymentStatus: data.payment_status,
      orderStatus: data.order_status,
      stripePaymentIntentId: data.stripe_payment_intent_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
router.patch('/:id/status', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (orderStatus !== undefined) updateData.order_status = orderStatus;
    if (paymentStatus !== undefined) updateData.payment_status = paymentStatus;

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Format the response to match frontend expectations
    const formattedOrder = {
      id: data.id,
      userId: data.user_id,
      items: data.items,
      shippingAddress: data.shipping_address,
      subtotal: data.subtotal,
      shipping: data.shipping,
      total: data.total,
      paymentMethod: data.payment_method,
      paymentStatus: data.payment_status,
      orderStatus: data.order_status,
      stripePaymentIntentId: data.stripe_payment_intent_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get order statistics
router.get('/stats/overview', verifyAdminToken, async (req, res) => {
  try {
    // Get total orders count
    const { count: totalOrders, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    // Get total revenue (sum of all order totals)
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total');

    if (revenueError) {
      throw revenueError;
    }

    const totalRevenue = revenueData.reduce((sum, order) => sum + parseFloat(order.total), 0);

    // Get orders by status
    const { data: statusData, error: statusError } = await supabase
      .from('orders')
      .select('order_status');

    if (statusError) {
      throw statusError;
    }

    const statusCounts = statusData.reduce((counts, order) => {
      counts[order.order_status] = (counts[order.order_status] || 0) + 1;
      return counts;
    }, {});

    res.json({
      totalOrders,
      totalRevenue,
      statusCounts
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
});

// Delete an order
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    // First check if order exists
    const { data: existingOrder, error: findError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (findError) {
      console.error('Error finding order:', findError);
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Delete the order
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order: ' + error.message });
  }
});

module.exports = router;