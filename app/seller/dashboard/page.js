'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import { motion } from 'framer-motion';

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch seller's products
        const productsRes = await fetch(`/api/products?sellerId=${session?.user?.id}`);
        const products = await productsRes.json();

        setStats((prev) => ({
          ...prev,
          totalProducts: Array.isArray(products) ? products.length : 0,
          totalRevenue: Array.isArray(products)
            ? products.reduce((sum, p) => sum + (p.price * p.stock * 0.1), 0)
            : 0,
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchStats();
    }
  }, [session?.user?.id]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (session?.user?.role !== 'seller') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Only sellers can access this page</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {session?.user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your store today.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: 'blue' },
            { label: 'Total Orders', value: stats.totalOrders, icon: '📋', color: 'green' },
            { label: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(0)}`, icon: '💰', color: 'yellow' },
            { label: 'Active Listings', value: stats.totalProducts, icon: '✨', color: 'purple' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</h3>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">📝 Daily Tasks</h2>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-xl">✓</span> Check pending orders
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">✓</span> Update product inventory
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">✓</span> Respond to customer reviews
              </li>
            </ul>
            <Link
              href="/seller/products"
              className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Manage Products →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">📊 Performance</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>This Month Sales</span>
                <span className="font-bold">₹{stats.totalRevenue.toFixed(0)}</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <Link
              href="/seller/analytics"
              className="inline-block bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              View Analytics →
            </Link>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
            <Link href="/seller/orders" className="text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          {stats.totalOrders === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No orders yet</p>
              <p className="text-gray-500 mt-2">When customers purchase, orders will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3">#ORD-001</td>
                    <td className="px-6 py-3">John Doe</td>
                    <td className="px-6 py-3">₹2,499</td>
                    <td className="px-6 py-3">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Pending
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
