# Admin Panel Guide

## Overview
This document provides instructions on how to use the enhanced Admin Panel for the PrintNSupply eCommerce website. The admin panel allows shopkeepers to manage products and orders with a modern, user-friendly interface.

## Accessing the Admin Panel

1. Navigate to `/admin/login` in your browser
2. Use the following credentials to log in:
   - Email: admin@printnsupply.com
   - Password: admin123

## Features

### Dashboard
The enhanced dashboard provides an overview of key metrics with a modern design:
- Total products with visual cards
- Total orders with status indicators
- Total revenue display
- Order status breakdown with charts
- Quick action buttons for common tasks

### Product Management
Manage all products in the store with improved UI:
- View all products in a responsive table with search functionality
- Add new products with name, price, description, image, category
- Edit existing products with a modal form
- Delete products with confirmation
- Product images with fallback placeholders

### Order Management
Manage customer orders with enhanced features:
- View all orders with order ID, customer name, date, total amount, and status
- Advanced filtering by order status
- Search by order ID, customer name, or email
- View detailed order information including:
  - Customer information (name, email, address, phone)
  - Ordered products (name, quantity, price) with images
  - Payment and order status
- Update order status with dropdown selector
- Visual status indicators with color coding

### Enhanced UI Features
- Modern gradient backgrounds and shadows
- Responsive design that works on all devices
- Smooth hover effects and transitions
- Consistent color scheme with indigo as primary color
- Intuitive navigation with sidebar
- Error handling with user-friendly messages
- Loading indicators for async operations
- Modal dialogs for detailed views
- Search and filter capabilities
- Custom styled dropdown menus with color-coded status indicators
- Visual feedback for all user interactions

## API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/register` - Admin registration (development only)

### Products
- `GET /api/admin/products` - Get all products
- `GET /api/admin/products/:id` - Get a specific product
- `POST /api/admin/products` - Create a new product
- `PUT /api/admin/products/:id` - Update a product
- `DELETE /api/admin/products/:id` - Delete a product
- `GET /api/admin/products/stats/overview` - Get product statistics

### Orders
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/:id` - Get a specific order
- `PATCH /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/orders/stats/overview` - Get order statistics

## Security
- All admin endpoints are protected with JWT tokens
- Tokens expire after 24 hours
- Only authorized admins can access the admin panel
- Passwords are securely hashed with bcrypt

## Development
To run the admin panel locally:
1. Start the backend server: `cd backend && npm start`
2. Start the frontend server: `cd frontend && npm run dev`
3. Access the admin panel at `http://localhost:5173/admin/login`

## UI Components

### Admin Login Page
- Modern gradient background
- Clean form design with icons
- Error handling with visual feedback
- Loading indicators during authentication
- Responsive layout for all devices

### Admin Layout
- Collapsible sidebar navigation
- Admin profile section with logout
- Consistent header and footer
- Mobile-friendly hamburger menu
- Smooth transitions and animations

### Dashboard
- Statistic cards with icons and shadows
- Order status visualization
- Quick action buttons
- Modern color scheme

### Product Management
- Searchable product table
- Category badges
- Image previews with fallback
- Modal forms for add/edit
- Confirmation dialogs for delete
- **Edit and delete action buttons** for each product

### Order Management
- Filterable order list
- Status color coding
- Detailed order modal
- Enhanced custom dropdown menus for status filtering and updates
- Payment method indicators

## UI Enhancements

### Custom Dropdown Menus
The admin panel now features custom-styled dropdown menus for both filtering orders by status and updating order status:

1. **Visual Design**:
   - Modern, clean appearance with subtle shadows
   - Smooth hover effects and transitions
   - Color-coded status indicators for quick recognition
   - Checkmarks for selected options
   - Consistent styling with the overall admin panel theme

2. **Status Filtering Dropdown**:
   - Located in the order management page
   - Allows filtering orders by status (All, Pending, Processing, Shipped, Delivered, Cancelled)
   - Each status option has a colored dot matching the status color scheme
   - Clear visual indication of the currently selected filter

3. **Order Status Update Dropdown**:
   - Located in the order details modal
   - Allows updating the status of individual orders
   - Same color-coded options as the filtering dropdown
   - Works in conjunction with the "Update" button to apply changes

4. **Benefits**:
   - Improved user experience with better visual feedback
   - Consistent design language throughout the admin panel
   - Easier status recognition through color coding
   - More intuitive than default browser dropdowns
   - Fully responsive and accessible

### Product Management Actions
The product management table includes action buttons for each product:

1. **Edit Button**:
   - Pencil icon for editing existing products
   - Opens a modal form pre-filled with current product data
   - Allows updating any product field
   - Validation for required fields (name and price)

2. **Delete Button**:
   - Trash can icon for deleting products
   - Shows confirmation dialog before deletion
   - Provides visual feedback on success or failure
   - Updates the product list immediately after deletion

3. **Add Product Button**:
   - Primary button in the header for adding new products
   - Opens a clean modal form for entering product details
   - Required field validation for name and price

## Troubleshooting

### 500 Internal Server Error When Adding Products

**Issue**: When trying to add a new product through the admin panel, you may encounter a "500 Internal Server Error" with a message about duplicate key violations.

**Cause**: This issue occurs when the PostgreSQL auto-increment sequence for the products table ID column is not properly synchronized with the existing data. This typically happens when initial data is inserted directly without updating the sequence.

**Solution**: The backend has been updated to handle this issue by explicitly setting the ID for new products to a value higher than the current maximum ID in the table. This ensures no conflicts occur with existing IDs.

**If you encounter this issue in your deployment**:
1. Check the backend logs for error messages about duplicate key violations
2. Ensure you're using the latest version of the adminProducts.js route file
3. If needed, manually fix the sequence in your database:

```sql
-- Get the maximum ID from the products table
SELECT MAX(id) FROM products;

-- Reset the sequence to the next available ID
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products) + 1);
```

### Product Delete Functionality Issues

**Issue**: Product deletion may fail with "Product not found" errors.

**Cause**: This can happen if:
1. The product has already been deleted
2. There's a synchronization issue with the database
3. The backend delete route had issues with the Supabase query

**Solution**: 
1. The backend delete route has been fixed to properly handle product deletion
2. Added better error handling and validation
3. Check that you're trying to delete an existing product

### Common Issues and Solutions

1. **CORS Errors**: Ensure the frontend URL is properly configured in the CORS settings in `server.js`
2. **Authentication Failures**: Verify the JWT secret is properly configured in environment variables
3. **Database Connection Issues**: Check Supabase credentials in `config/supabase.js`
4. **Missing Environment Variables**: Ensure all required environment variables are set

## Customization
The admin panel uses Tailwind CSS for styling, making it easy to customize:
- Color scheme can be changed by updating Tailwind config
- Layout can be modified by adjusting grid classes
- Components can be extended or replaced
- New features can be added following the existing patterns