'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import ProductCard from '@/app/components/ProductCard';
import Toast from '@/app/components/Toast';
import { motion } from 'framer-motion';

export default function BuyerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);

    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
      // Show "quantity increased" toast
      setToast({
        message: `✅ Added 1 more ${product.name} to cart!`,
        type: 'success',
      });
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
      // Show "added to cart" toast
      setToast({
        message: `✅ ${product.name} added to cart!`,
        type: 'success',
      });
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId, productName) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setToast({
      message: `🗑️ Removed ${productName} from cart`,
      type: 'info',
    });
  };

  const updateQuantity = (productId, newQuantity, productName) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, productName);
      return;
    }
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </motion.div>

        {/* Empty Cart Message */}
        {cart.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-md p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h3>
            <p className="text-gray-600 mb-6">No items in your cart. Start shopping!</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT SECTION - CART ITEMS */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                {cart.map((item, index) => (
                  <motion.div
                    key={item._id}
                    className={`p-6 border-b last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex gap-6">
                      {/* PRODUCT IMAGE */}
                      <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {item.image || item.images?.[0] ? (
                          <img
                            src={item.image || item.images?.[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </div>

                      {/* PRODUCT DETAILS - CENTER */}
                      <div className="flex-grow">
                        {/* Product Name and Badges */}
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                          
                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.originalPrice && (
                              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                              </span>
                            )}
                            {item.stock < 10 && item.stock > 0 && (
                              <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                                Only {item.stock} left
                              </span>
                            )}
                          </div>

                          {/* Seller Info */}
                          <p className="text-sm text-gray-600">Sold by: {item.sellerId?.storeName || 'SuperMart'}</p>
                        </div>

                        {/* Price Section */}
                        <div className="mb-4 flex items-center gap-3">
                          <span className="text-2xl font-bold text-blue-600">₹{item.price.toFixed(2)}</span>
                          {item.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">₹{item.originalPrice.toFixed(2)}</span>
                          )}
                        </div>

                        {/* Quantity Controls + Actions */}
                        <div className="flex flex-wrap items-center gap-4">
                          {/* QUANTITY SELECTOR - Yellow Box Style */}
                          <div className="flex items-center border-2 border-yellow-400 rounded-full px-2 py-1 bg-yellow-50">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1, item.name)}
                              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gray-900 font-bold text-lg"
                            >
                              −
                            </button>
                            <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1, item.name)}
                              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gray-900 font-bold text-lg"
                            >
                              +
                            </button>
                          </div>

                          {/* ACTION BUTTONS */}
                          <button
                            onClick={() => removeFromCart(item._id, item.name)}
                            className="text-gray-700 hover:text-red-600 font-semibold text-sm"
                          >
                            🗑️ Delete
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                            💾 Save for later
                          </button>
                        </div>
                      </div>

                      {/* TOTAL PRICE FOR THIS ITEM - RIGHT */}
                      <div className="flex flex-col items-end justify-center min-w-max">
                        <span className="text-2xl font-bold text-gray-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Subtotal</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT SECTION - SUMMARY & CHECKOUT */}
            <div>
              <motion.div
                className="bg-white rounded-lg shadow-md p-6 sticky top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {/* SUBTOTAL SECTION */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-gray-700 text-sm mb-2">
                    Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''}):
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    ₹{getTotalPrice().toFixed(2)}
                  </p>
                </div>

                {/* PROCEED TO BUY BUTTON - YELLOW/PROMINENT */}
                <motion.button
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg mb-4 transition text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Buy
                </motion.button>

                {/* ADDITIONAL OPTIONS */}
                <div className="space-y-3 pt-4 border-t">
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition text-sm">
                    📦 Save 5%
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition text-sm">
                    🎟️ Collect Coupon
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition text-sm">
                    💳 EMI Available
                  </button>
                </div>

                {/* DELIVERY INFO */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-2">✓ Free delivery on orders over ₹500</p>
                  <p className="text-sm text-gray-600">✓ Secure checkout with encryption</p>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* RECOMMENDED SECTION */}
        {cart.length > 0 && products.length > 0 && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customers who bought items in your cart also bought</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (
                <motion.div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.image || product.images?.[0] ? (
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 h-14 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <motion.button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
                      whileHover={{ scale: 1.02 }}
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
