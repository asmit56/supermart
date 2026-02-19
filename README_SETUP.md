# SuperMart - E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js 14, MongoDB, NextAuth.js, and Framer Motion. This platform allows sellers to manage their stores and customers to shop seamlessly, similar to Amazon.

## Features

### For Buyers 👤
- Browse products without login
- Search and filter products by category
- View detailed product information
- Add to cart functionality
- User-friendly shopping interface
- Profile management
- Order history (coming soon)

### For Sellers 🏪
- Create and manage store
- Add/Edit/Delete products
- Inventory management
- Order management
- Sales analytics
- Store customization
- Switch between buyer and seller mode

### General Features
- User authentication (NextAuth.js)
- Responsive design (Mobile, Tablet, Desktop)
- Smooth animations (Framer Motion)
- Beautiful UI (Tailwind CSS)
- MongoDB database
- Fast performance optimization

## Tech Stack

- **Framework:** Next.js 14
- **Database:** MongoDB
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Password Hashing:** bcryptjs
- **Deployment Ready:** Yes

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- MongoDB (Local or Cloud - MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd d:/nextjs/suppermart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   - If using local MongoDB, make sure it's running:
     ```bash
     mongod
     ```
   - Or use MongoDB Atlas (Cloud):
     - Create an account at https://www.mongodb.com/cloud/atlas
     - Create a cluster and get connection string

4. **Configure environment variables**
   - Update `.env.local` file:
     ```
     MONGODB_URI=mongodb://localhost:27017/suppermart
     NEXTAUTH_SECRET=your-secret-key-change-this
     NEXTAUTH_URL=http://localhost:3000
     ```

5. **Initialize demo data**
   - Before running the app, initialize demo data:
     ```bash
     curl http://localhost:3000/api/init
     ```
   - Or visit the URL directly in your browser

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Navigate to `http://localhost:3000`

## Demo Credentials

### Seller Account
- **Email:** seller@demo.com
- **Password:** demo123
- **Access:** Full dashboard, product management

### Buyer Account
- **Email:** buyer@demo.com
- **Password:** demo123
- **Access:** Shopping, cart, product browsing

## Project Structure

```
suppermart/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── users/
│   │   └── init/ (Demo data initialization)
│   ├── components/ (Reusable components)
│   ├── buyer/ (Buyer pages)
│   ├── seller/ (Seller pages)
│   ├── auth/ (Authentication pages)
│   ├── layout.js
│   ├── page.js (Home page)
│   └── globals.css
├── lib/
│   ├── models/ (MongoDB schemas)
│   └── mongodb.js (Database connection)
├── middleware.js (Route protection)
├── .env.local (Environment variables)
├── package.json
├── next.config.mjs
├── tailwind.config.js
└── README.md
```

## Usage Guide

### For Shoppers
1. Visit the home page to browse products
2. Click "Start Shopping" to login or create account as buyer
3. Add products to cart
4. Proceed to checkout (functionality in development)

### For Sellers
1. Click "Join as Seller" and register
2. Login with seller credentials
3. Access dashboard to view sales and stats
4. Go to "Products" section to add new products
5. Manage inventory and orders
6. Switch to buyer mode to shop

## Key Pages

- `/` - Home page (Public)
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/seller/dashboard` - Seller dashboard
- `/seller/products` - Manage products
- `/buyer/dashboard` - Shopping dashboard
- `/buyer/search` - Search products
- `/buyer/product/[id]` - Product details

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Products
- `GET /api/products` - Fetch all products
- `POST /api/products` - Create product (Seller only)
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Users
- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/[id]` - Update user profile

### Demo Data
- `GET /api/init` - Initialize demo data

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Payment integration (Stripe, Razorpay)
- [ ] Order tracking
- [ ] Reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search filters
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Real-time notifications
- [ ] Image upload system
- [ ] Multi-language support

## Performance Optimizations

- ✅ Next.js Image optimization
- ✅ Code splitting and lazy loading
- ✅ Database query optimization
- ✅ Caching strategies
- ✅ CSS purging with Tailwind
- ✅ Smooth animations with Framer Motion

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env.local`
- Verify network access if using MongoDB Atlas

### NextAuth Issues
- Clear browser cookies
- Verify NEXTAUTH_SECRET is set
- Check session strategy settings

### API Errors
- Check browser console for errors
- Verify request format matches API requirements
- Check MongoDB is accessible

## Contributing

Feel free to fork and submit pull requests!

## License

MIT License - feel free to use this project for personal or commercial use.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Create an issue on GitHub

---

**Happy Shopping! 🛍️ Happy Selling! 🏪**
