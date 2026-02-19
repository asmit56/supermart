'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import ProductCard from '@/app/components/ProductCard';
import { motion } from 'framer-motion';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/products?search=${query}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Search Results for: <span className="text-blue-600">"{query}"</span>
          </h1>
          <p className="text-gray-600 mt-2">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-md p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">Try searching for something else</p>
            <Link href="/" className="text-blue-600 hover:underline font-semibold">
              Back to Home
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>}>
      <SearchContent />
    </Suspense>
  );
}
