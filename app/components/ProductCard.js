'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductCard({ product, onAddToCart, isSellerView = false }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Ensure stock is always a number with fallback
  const stock = parseInt(product.stock) || 0;
  
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const attachments = (product.images && product.images.length > 0 ? product.images : []) || 
    (product.image ? [product.image] : []);
  const currentAttachment = attachments[currentImageIndex] || product.image;
  const isVideo = currentAttachment && currentAttachment.includes('data:video/');

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (attachments.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (attachments.length || 1)) % (attachments.length || 1));
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Image Container - FIXED FOR BETTER IMAGE DISPLAY */}
      <div className={`relative h-48 bg-gray-100 group overflow-hidden ${stock === 0 ? 'opacity-60' : ''}`}>
        {currentAttachment && !isVideo ? (
          <img
            src={currentAttachment}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
            }}
          />
        ) : null}
        {currentAttachment && isVideo ? (
          <video
            src={currentAttachment}
            controls
            className="w-full h-full object-cover"
            poster={attachments[0]}
          />
        ) : null}
        {!currentAttachment && (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-500 font-semibold">No Image Available</span>
          </div>
        )}

        {/* Navigation buttons for multiple attachments */}
        {attachments.length > 1 && stock > 0 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10 hover:bg-opacity-75"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10 hover:bg-opacity-75"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">
              {currentImageIndex + 1} / {attachments.length}
            </div>
          </>
        )}

        {/* Discount Badge */}
        {discount > 0 && stock > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-20">
            -{discount}%
          </div>
        )}

        {/* Low Stock Warning */}
        {stock > 0 && stock < 100 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold z-20">
            Low Stock
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 h-14">
          {product.name}
        </h3>

        {/* OUT OF STOCK STATUS - MOVED BELOW NAME FOR BETTER VISIBILITY */}
        {stock === 0 && (
          <div className="mb-2 px-3 py-2 bg-red-100 border-2 border-red-500 rounded-lg text-center">
            <span className="text-red-700 font-bold text-sm">🚫 Out of Stock</span>
          </div>
        )}

        <p className="text-gray-500 text-sm mb-3">
          By {product.sellerId?.storeName || product.sellerId?.name}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-lg">₹{product.originalPrice}</span>
          )}
        </div>

        {stock > 0 && stock < 100 && (
          <div className="mb-2">
            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
              ⚠ Low in Stock - Only {stock} left
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 mb-4">
          <span className="text-yellow-400">★</span>
          <span className="text-sm text-gray-600">{product.rating || 'No ratings'}</span>
        </div>

        {attachments.length > 1 && (
          <div className="flex gap-1 mb-3">
            {attachments.slice(0, 4).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`text-xs px-2 py-1 rounded transition ${
                  idx === currentImageIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {idx === 3 && attachments.length > 4 ? `+${attachments.length - 3}` : idx + 1}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {isSellerView ? (
            <>
              <Link
                href={`/seller/products/${product._id}/edit`}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center font-semibold text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this product?')) {
                    fetch(`/api/products/${product._id}`, { method: 'DELETE' })
                      .then(res => { if (res.ok) window.location.reload(); })
                      .catch(err => console.error('Delete error:', err));
                  }
                }}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-semibold text-sm"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <Link
                href={`/product/${product._id}`}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center font-semibold"
              >
                View
              </Link>
              <button
                onClick={() => onAddToCart && onAddToCart(product)}
                disabled={stock === 0}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
