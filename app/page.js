'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/app/components/Navbar';
import ProductCard from '@/app/components/ProductCard';
import Toast from '@/app/components/Toast';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const allProducts = Array.isArray(data) ? data : [];
        setProducts(allProducts);

        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(allProducts.map((p) => p.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    // Check if user is logged in
    if (!session) {
      setToast({
        message: '❌ Please log in to add items to cart',
        type: 'warning',
      });
      // Redirect to login after 1 second
      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
      return;
    }

    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      // Increase quantity if already in cart
      existingItem.quantity += 1;
      setToast({
        message: `✅ Added 1 more ${product.name} to cart!`,
        type: 'success',
      });
    } else {
      // Add new product to cart
      cart.push({ ...product, quantity: 1 });
      setToast({
        message: `✅ ${product.name} added to cart!`,
        type: 'success',
      });
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const filteredProducts =
    selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);

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

      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-5xl font-bold mb-6"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome to SuperMart! 🛍️
          </motion.h1>
          <motion.p
            className="text-xl mb-8 opacity-90"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Shop from thousands of products across all categories
          </motion.p>

          {!session && (
            <motion.div className="flex gap-4 justify-center" whileHover={{ scale: 1.05 }}>
              <Link
                href="/auth/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Join as Seller
              </Link>
              <Link
                href="/auth/login"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition"
              >
                Start Shopping
              </Link>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories Filter */}
        {categories.length > 0 && (
          <motion.div
            className="mb-8 flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-md p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600">Check back soon for new items in this category</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <motion.footer
        className="bg-gray-800 text-white mt-20 py-12 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">SuperMart</h3>
            <p className="text-gray-400">Your one-stop shop for everything you need.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Sellers</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/auth/register" className="hover:text-white transition">
                  Start Selling 
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Facebook</li>
              <li>Twitter</li>
              <li>Instagram</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SuperMart. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
}
