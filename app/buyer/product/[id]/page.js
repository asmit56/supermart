'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Toast from '@/app/components/Toast';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function ProductPage() {
  const params = useParams();
  const { id } = params;
  const { data: session } = useSession();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!session) {
      setToast({
        message: '❌ Please log in to add items to cart',
        type: 'warning',
      });
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
      setToast({
        message: `✅ Added ${quantity} more to cart!`,
        type: 'success',
      });
    } else {
      cart.push({ ...product, quantity });
      setToast({
        message: `✅ ${product.name} added to cart!`,
        type: 'success',
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const stock = parseInt(product.stock) || 0;
  const attachments = (product.images && product.images.length > 0 ? product.images : []) || 
    (product.image ? [product.image] : []);
  const currentAttachment = attachments[currentImageIndex] || product.image;

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
        {/* Breadcrumb */}
        <motion.div className="mb-8 text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span> / {product.category} / </span>
          <span className="text-gray-800 font-semibold">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center min-h-96"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* OUT OF STOCK BADGE - Shows prominently if product is unavailable */}
            {stock === 0 && (
              <div className="w-full mb-4 px-4 py-3 bg-red-100 border-2 border-red-500 rounded-lg text-center">
                <span className="text-red-700 font-bold text-lg">🚫 Out of Stock</span>
              </div>
            )}

            {/* PRODUCT IMAGE DISPLAY */}
            <div className={`w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg relative group ${stock === 0 ? 'opacity-70' : ''}`}>
              {currentAttachment ? (
                <img 
                  src={currentAttachment}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-center">
                  <span className="text-gray-500 text-lg font-semibold">No Image Available</span>
                  <p className="text-gray-400 text-sm mt-2">Product image will appear here</p>
                </div>
              )}

              {/* IMAGE CAROUSEL NAVIGATION - Show if multiple images exist */}
              {attachments.length > 1 && stock > 0 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + attachments.length) % attachments.length)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10 hover:bg-opacity-75"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % attachments.length)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10 hover:bg-opacity-75"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">
                    {currentImageIndex + 1} / {attachments.length}
                  </div>
                </>
              )}
            </div>

            {/* IMAGE THUMBNAILS - Quick access to other images */}
            {attachments.length > 1 && (
              <div className="flex gap-2 mt-4 w-full">
                {attachments.slice(0, 4).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-1 h-16 rounded-lg border-2 overflow-hidden transition ${
                      idx === currentImageIndex
                        ? 'border-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img 
                      src={attachments[idx]}
                      alt={`Product view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {attachments.length > 4 && (
                  <div className="flex-1 h-16 rounded-lg bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">+{attachments.length - 4}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Category & Rating */}
            <div className="mb-4 flex items-center gap-4">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                {product.category}
              </span>
              <span className="text-yellow-500">★★★★☆</span>
              <span className="text-sm text-gray-600">(142 reviews)</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-blue-600">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              {discount > 0 && (
                <span className="text-lg font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className={`mb-6 p-4 rounded-lg ${stock > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className={`font-semibold ${stock > 0 ? 'text-green-800' : 'text-red-700'}`}>
                {stock > 0 ? `✓ In Stock (${stock} available)` : '🚫 Out of Stock'}
              </p>
            </div>

            {/* Seller Info */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700">
                <strong>Sold by:</strong> {product.sellerId?.storeName || product.sellerId?.name}
              </p>
              {product.sellerId?.storeDescription && (
                <p className="text-gray-600 text-sm mt-2">{product.sellerId.storeDescription}</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center gap-3">
                <label className={`font-semibold ${stock > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                  Quantity:
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.min(stock, Math.max(1, val)));
                  }}
                  min="1"
                  max={stock}
                  disabled={stock === 0}
                  className="w-24 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white text-black font-bold text-lg text-center disabled:bg-gray-200 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                whileHover={stock > 0 ? { scale: 1.05 } : {}}
                whileTap={stock > 0 ? { scale: 0.95 } : {}}
              >
                🛒 Add to Cart
              </motion.button>
              <motion.button
                disabled={stock === 0}
                className="bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                whileHover={stock > 0 ? { scale: 1.05 } : {}}
                whileTap={stock > 0 ? { scale: 0.95 } : {}}
              >
                ⚡ Buy Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
