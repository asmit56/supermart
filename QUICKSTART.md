# 🚀 SuperMart Quick Start Guide

## ⚡ Quick Setup (5 minutes)

### 1️⃣ Prerequisites
- Make sure MongoDB is running on your computer
- Node.js v16+ installed
- Port 3000 is available

### 2️⃣ Environment Setup
Edit `.env.local` file:
```
MONGODB_URI=mongodb://localhost:27017/suppermart
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 3️⃣ Start the App
```bash
npm run dev
```

### 4️⃣ Initialize Demo Data
In a new terminal:
```bash
curl http://localhost:3000/api/init
```
Or open this URL in your browser:
```
http://localhost:3000/api/init
```

### 5️⃣ Login and Test

**As a Seller:**
- Email: `seller@demo.com`
- Password: `demo123`
- Dashboard: `http://localhost:3000/seller/dashboard`

**As a Buyer:**
- Email: `buyer@demo.com`
- Password: `demo123`
- Store: `http://localhost:3000/buyer/dashboard`

---

## 📱 Main Features to Try

### 👤 Buyer Experience
1. ✅ Browse products without login on home page
2. ✅ Login as buyer with demo credentials
3. ✅ View products in buyer dashboard
4. ✅ Add products to cart
5. ✅ Search products by keyword
6. ✅ View product details
7. ✅ Switch profile to seller mode

### 🏪 Seller Experience
1. ✅ Login as seller
2. ✅ View dashboard with statistics
3. ✅ Add new products
4. ✅ View all your products
5. ✅ Edit product information
6. ✅ Manage inventory
7. ✅ Switch profile to buyer mode

---

## 🎨 UI/UX Features

- **Smooth Animations** - Framer Motion animations on all interactions
- **Responsive Design** - Mobile, tablet, and desktop support
- **Beautiful Colors** - Blue gradient theme with accent colors
- **Intuitive Navigation** - Easy to navigate between sections
- **Real-time Updates** - Products update as you add them
- **Shopping Cart** - Client-side cart with localStorage persistence

---

## 🔧 Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Verify Node.js is installed: `node -v`
- Clear cache: `rm -rf .next` then try again

### Can't login
- Verify `.env.local` has correct configuration
- Run demo data initialization: `curl http://localhost:3000/api/init`
- Clear browser cookies and try again

### MongoDB connection error
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas and update connection string
- Verify network access for MongoDB Atlas

### Products not showing
- Run demo data initialization
- Check browser console for errors (F12)
- Verify MongoDB is running and connected

---

## 📂 Project Structure Overview

```
suppermart/
├── app/
│   ├── page.js           → Home page (public)
│   ├── layout.js         → Root layout with SessionProvider
│   ├── globals.css       → Global styles
│   ├── api/
│   │   ├── auth/         → Authentication endpoints
│   │   ├── products/     → Product CRUD endpoints
│   │   ├── users/        → User profile endpoints
│   │   └── init/         → Demo data initialization
│   ├── auth/
│   │   ├── login/        → Login page
│   │   └── register/     → Registration page
│   ├── seller/
│   │   ├── dashboard/    → Seller dashboard
│   │   └── products/     → Product management
│   ├── buyer/
│   │   ├── dashboard/    → Shopping dashboard
│   │   ├── search/       → Search results
│   │   └── product/      → Product details
│   └── components/       → Reusable components
├── lib/
│   ├── models/           → MongoDB schemas
│   └── mongodb.js        → DB connection
├── middleware.js         → Route protection
└── .env.local           → Environment variables
```

---

## 🎯 Next Steps

### To Enhance the Platform:
1. **Payment Integration**
   - Add Stripe or Razorpay
   - Implement checkout flow

2. **Order Management**
   - Complete order tracking
   - Order status updates
   - Email notifications

3. **Reviews System**
   - Add product reviews
   - Rating functionality
   - Buyer feedback

4. **Admin Panel**
   - Site-wide analytics
   - User management
   - Dispute resolution

5. **Image Upload**
   - Product image upload
   - Multiple images support
   - Image optimization

---

## 📞 Support

For issues:
1. Check troubleshooting section above
2. Review console errors (F12 in browser)
3. Check MongoDB connection
4. Verify `.env.local` configuration

---

## 🎉 You're All Set!

The prototype is ready to explore. Happy shopping and selling! 🛍️ 🏪

Visit: http://localhost:3000
