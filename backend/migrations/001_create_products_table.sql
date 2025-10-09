-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add some indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Insert initial product data
INSERT INTO products (name, description, price, category, image) VALUES
  ('Business Cards', 'Professional business cards with premium finish', 1659.17, 'stationery', '/images/business-cards.jpg'),
  ('Flyers', 'Eye-catching flyers for your business promotion', 2489.17, 'marketing', '/images/flyers.jpg'),
  ('Posters', 'Large format posters for events and advertising', 3319.17, 'marketing', '/images/posters.jpg'),
  ('Brochures', 'Informative brochures to showcase your services', 4149.17, 'marketing', '/images/brochures.jpg'),
  ('Premium Fountain Pen', 'Classic Design', 2074.17, 'Pens & Pencils', 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800'),
  ('Premium Notebook', 'Hardcover A5', 1669.17, 'Notebooks', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800'),
  ('Art Markers Set', '12 Colors', 2904.17, 'Art Supplies', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800'),
  ('Mechanical Pencil', '0.5mm Lead', 1078.17, 'Pens & Pencils', 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=800'),
  ('Desk Organizer Set', 'Gold Accent', 2499.17, 'Office Supplies', 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800'),
  ('Washi Tape Set', '10 Patterns', 1327.17, 'Art Supplies', 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=800'),
  ('Leather Pencil Case', 'Genuine Leather', 3329.17, 'Office Supplies', 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800'),
  ('Desk Calendar', 'Wooden Stand', 1908.17, 'Office Supplies', 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800');