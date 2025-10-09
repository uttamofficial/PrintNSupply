# Ez-Prints Backend

This is the backend service for the Ez-Prints application, built with Node.js, Express, and Supabase.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

3. Update the `.env` file with your Supabase credentials:
   - SUPABASE_URL: Your Supabase project URL
   - SUPABASE_KEY: Your Supabase project API key

4. Run the development server:
   ```
   npm run dev
   ```

5. For production:
   ```
   npm start
   ```

## API Endpoints

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get a specific product
- POST `/api/products` - Create a new product
- PUT `/api/products/:id` - Update a product
- DELETE `/api/products/:id` - Delete a product

### Authentication
- POST `/api/auth/signup` - User signup
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/profile` - Get user profile

## Database Schema

The application uses the following tables in Supabase:

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Users
Uses Supabase Auth for user management.