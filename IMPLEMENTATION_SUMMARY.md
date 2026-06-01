# FitVibe - AI Virtual Try-On Fashion Store MVP

## Project Overview

FitVibe is a full-stack e-commerce platform with AI-powered virtual try-on functionality, built with Next.js 16, Neon PostgreSQL, Better Auth, and Midtrans payments.

## Architecture

### Technology Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes, Server Actions
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth (email/password + Google OAuth)
- **Payments**: Midtrans (VA, QRIS, DANA)
- **AI/ML**: Replicate (IDM-VTON for virtual try-on)
- **Image Storage**: Vercel Blob (configured)
- **Styling**: Tailwind CSS v4 with custom design tokens

### Database Schema

```
Tables Created:
├── user (Better Auth)
├── session (Better Auth)
├── account (OAuth support)
├── verification (Email verification)
├── products (Clothing catalog)
├── admin_users (Admin management)
├── cart_items (Shopping cart)
├── orders (Order history)
└── order_items (Order line items)
```

## Features Implemented

### Customer Features
✅ **Authentication**
- Email/Password signup and login
- Google OAuth integration
- Session management via Better Auth

✅ **Product Catalog**
- Browse all products with filtering by category
- Detailed product page with images, description, pricing
- Stock management display
- Size and color selection

✅ **Shopping Cart**
- Add products to cart with size/color selection
- View cart items with quantities
- Update quantities and remove items
- Calculate total price

✅ **Checkout & Payment**
- Order creation from cart items
- Midtrans payment integration
- Multiple payment methods (Bank Transfer/VA, QRIS, DANA)
- Order confirmation and status tracking

✅ **AI Try-On**
- API endpoint for Replicate integration
- Upload user image + garment image
- Generate virtual try-on preview
- Uses IDM-VTON model for high-quality results

✅ **Order History**
- View past orders with status
- Order details page showing items purchased
- Payment status tracking

### Admin Features
✅ **Product Management**
- Create new products
- Edit existing products (name, price, description, etc.)
- Upload product images
- Manage stock levels
- Set available sizes and colors
- Delete products

✅ **Order Management**
- View all orders
- Filter orders by status
- Update order status (pending, paid, shipped, delivered)
- View order details and items

## Environment Variables Required

```env
# Database
DATABASE_URL=your_neon_db_connection_string

# Authentication
BETTER_AUTH_SECRET=your_random_secret_key (openssl rand -base64 32)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret

# Payments (Midtrans)
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key

# AI/ML (Replicate)
REPLICATE_API_TOKEN=your_replicate_api_token
```

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── page.tsx                    # Home page with hero section
│   ├── layout.tsx                  # Root layout with metadata
│   ├── api/
│   │   ├── auth/[...all]/route.ts # Better Auth handler
│   │   ├── try-on/route.ts        # AI try-on endpoint
│   │   └── payment/callback/route.ts # Midtrans webhook
│   ├── sign-in/page.tsx           # Login page
│   ├── sign-up/page.tsx           # Registration page
│   ├── products/
│   │   ├── page.tsx               # Product catalog
│   │   └── [id]/page.tsx          # Product detail + try-on
│   ├── cart/page.tsx              # Shopping cart
│   ├── checkout/page.tsx          # Checkout flow
│   ├── orders/
│   │   ├── page.tsx               # Order history
│   │   └── [id]/page.tsx          # Order details
│   └── admin/
│       ├── products/
│       │   ├── page.tsx           # Product list
│       │   ├── new/page.tsx       # Create product
│       │   └── [id]/edit/page.tsx # Edit product
│       └── orders/page.tsx        # Order management
├── app/actions/
│   ├── products.ts                # Product CRUD actions
│   ├── cart.ts                    # Cart management
│   └── orders.ts                  # Order processing
├── components/
│   ├── auth-form.tsx              # Login/signup form with Google OAuth
│   ├── product-card.tsx           # Product card component
│   ├── product-form.tsx           # Product edit/create form
│   ├── cart-item.tsx              # Cart item component
│   └── ...ui components           # Shadcn components
├── lib/
│   ├── auth.ts                    # Better Auth configuration
│   ├── auth-client.ts             # Better Auth client
│   ├── db/
│   │   ├── index.ts               # Drizzle setup
│   │   └── schema.ts              # Database schema
│   └── utils.ts
└── public/
    └── icons/                     # Favicon assets
```

## API Routes

### Authentication
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login user
- `GET /api/auth/callback/google` - Google OAuth callback

### Products
- `GET /app/actions/products#getProducts` - Fetch all products
- `GET /app/actions/products#getProductById` - Fetch product by ID
- `POST /app/actions/products#createProduct` - Create product (admin)
- `PUT /app/actions/products#updateProduct` - Update product (admin)
- `DELETE /app/actions/products#deleteProduct` - Delete product (admin)

### Cart
- `POST /app/actions/cart#addToCart` - Add item to cart
- `POST /app/actions/cart#updateCartItem` - Update quantity
- `POST /app/actions/cart#removeFromCart` - Remove item
- `GET /app/actions/cart#getCart` - Get cart items

### Orders
- `POST /app/actions/orders#createOrder` - Create order from cart
- `GET /app/actions/orders#getUserOrders` - Get user's orders
- `GET /app/actions/orders#getOrderById` - Get order details
- `GET /app/actions/orders#getAllOrders` - Get all orders (admin)
- `PUT /app/actions/orders#updateOrderStatus` - Update order status (admin)

### AI Try-On
- `POST /api/try-on` - Generate virtual try-on (Replicate)

### Payments
- `POST /api/payment/callback` - Midtrans webhook handler

## Key Features & Highlights

### Security
- Server-side authentication with Better Auth
- Per-query userId scoping (no RLS on Neon)
- Parameterized SQL queries via Drizzle
- CSRF protection via Next.js built-in
- Secure session cookies

### Performance
- Next.js 16 with Turbopack bundler
- Optimized images with next/image
- Server Components for initial page load
- Drizzle ORM for efficient database queries
- Database indexes for common queries

### User Experience
- Beautiful dark theme with cyan accents (FitVibe branding)
- Responsive design (mobile, tablet, desktop)
- Smooth navigation and transitions
- Real-time cart updates
- Visual product try-on feedback

### Payment Processing
- Multiple payment methods (VA, QRIS, DANA)
- Secure Midtrans integration
- Webhook-based order status updates
- Transaction ID tracking

## Getting Started

### Installation
```bash
# Install dependencies
pnpm install

# Set up environment variables (see above)
# Add to .env.local

# Run database schema (already done)
# See schema in app/api/auth/[...all]/route.ts

# Start dev server
pnpm dev
```

### First Time Setup
1. Sign up with email/password or Google
2. Admin dashboard: Add products (admin panel)
3. Browse products and try virtual try-on
4. Add to cart and checkout
5. Complete payment with test credentials

## Deployment

Deploy to Vercel with:
```bash
vercel deploy
```

Environment variables will be auto-synced from your Vercel project settings.

## Known Limitations & Future Enhancements

### Current Limitations
- AI try-on is basic POC (needs model optimization for clothing)
- No inventory management (stock not real-time synced)
- Admin dashboard is minimal (no analytics/reporting)
- Payment confirmation is webhook-based (may have slight delays)

### Future Enhancements
- Advanced try-on with body pose detection
- Inventory sync with warehousing system
- Admin analytics dashboard
- Customer reviews and ratings
- Wishlist functionality
- Multi-language support
- Email notifications
- SMS OTP for sensitive operations
- Advanced search and filtering
- Recommendation engine

## Troubleshooting

### "AUTH ERRORS" - 
Ensure `BETTER_AUTH_SECRET` is set and at least 32 characters

### Midtrans Integration Issues
- Verify `MIDTRANS_SERVER_KEY` and `MIDTRANS_CLIENT_KEY` are correct
- Test mode vs production mode - ensure consistency
- Webhook URL must be publicly accessible

### Database Connection
- Verify `DATABASE_URL` is a valid Neon connection string
- Check firewall rules allow your app to connect
- Use Neon dashboard to verify database exists

### AI Try-On Errors
- Ensure `REPLICATE_API_TOKEN` is valid
- Check Replicate account has sufficient credits
- Model `cuuuomua/idm-vton:...` must be available

## Support

For issues, check:
1. Console logs in development (pnpm dev)
2. Vercel deployment logs (vercel logs)
3. Database logs (Neon dashboard)
4. Payment logs (Midtrans dashboard)

## License

This project is built with v0 and uses open-source libraries as specified in package.json.
