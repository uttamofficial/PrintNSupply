#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${RED}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${RED}         ⚠️  CRITICAL: ORDERS TABLE NOT FOUND ⚠️${NC}"
echo -e "${RED}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Your payment system is failing because the 'orders' table"
echo -e "doesn't exist in Supabase yet.${NC}"
echo ""
echo -e "${GREEN}✅ QUICK FIX (2 minutes):${NC}"
echo ""
echo -e "${BLUE}Step 1:${NC} Open this URL in your browser:"
echo -e "        ${BLUE}https://qlchpejqhdjzbfikvlzw.supabase.co/project/_/sql${NC}"
echo ""
echo -e "${BLUE}Step 2:${NC} Click the ${GREEN}'New Query'${NC} button"
echo ""
echo -e "${BLUE}Step 3:${NC} Copy this entire SQL code:"
echo ""
echo -e "${YELLOW}────────────────────────────────────────────────────────────${NC}"
cat << 'EOF'
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    items JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('COD', 'Online')),
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed')),
    order_status TEXT NOT NULL DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
EOF
echo -e "${YELLOW}────────────────────────────────────────────────────────────${NC}"
echo ""
echo -e "${BLUE}Step 4:${NC} Paste the SQL in Supabase SQL Editor"
echo ""
echo -e "${BLUE}Step 5:${NC} Click the ${GREEN}'Run'${NC} button (▶️)"
echo ""
echo -e "${BLUE}Step 6:${NC} You should see: ${GREEN}'Success. No rows returned'${NC}"
echo ""
echo -e "${GREEN}✅ DONE!${NC} Your payment system will now work!"
echo ""
echo -e "${YELLOW}Test it:${NC}"
echo "  1. Go to: ${BLUE}http://localhost:5174/stationery${NC}"
echo "  2. Add products to cart"
echo "  3. Go to Cart → Checkout"
echo "  4. Fill shipping info"
echo "  5. Click 'Place Order'"
echo "  6. ✅ Should work!"
echo ""
echo -e "${RED}═══════════════════════════════════════════════════════════════${NC}"
echo ""
