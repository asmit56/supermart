'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      router.push(`/buyer/search?q=${query}`);
    }
  };

  const handleRoleSwitch = () => {
    if (session?.user?.role === 'seller') {
      // Switch to buyer view (redirect to buyer dashboard)
      router.push('/buyer/dashboard');
    } else if (session?.user?.role === 'buyer') {
      // Switch to seller view (redirect to seller dashboard)
      router.push('/seller/dashboard');
    }
  };

  return (
    <motion.nav
      className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">S</span>
            </div>
            SuperMart
          </Link>

          {/* Search bar (for buyers) */}
          {session?.user?.role === 'buyer' && (
            <div className="flex-1 mx-8 hidden md:flex">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg text-black focus:outline-none bg-white placeholder-gray-800 font-medium"
                onChange={handleSearch}
              />
            </div>
          )}

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {!session ? (
              <>
                <Link href="/auth/login" className="hover:bg-blue-700 px-4 py-2 rounded transition">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition font-semibold">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {session.user.role === 'seller' && (
                  <Link href="/seller/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded transition">
                    Dashboard
                  </Link>
                )}
                {session.user.role === 'buyer' && (
                  <Link href="/buyer/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded transition">
                    My Cart
                  </Link>
                )}

                <button
                  onClick={handleRoleSwitch}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded transition text-sm text-blue-700"
                >
                  Switch to {session.user.role === 'seller' ? 'Buyer' : 'Seller'}
                </button>

                <div className="relative group">
                  <button className="hover:bg-blue-700 px-3 py-2 rounded transition">
                    {session.user.name}
                  </button>
                  <div className="hidden group-hover:block absolute right-0 bg-white text-gray-800 rounded shadow-lg w-40">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition rounded-t"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            className="md:hidden pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Mobile Search Bar */}
            {session?.user?.role === 'buyer' && (
              <div className="px-4 py-3 border-b border-blue-500">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded-lg text-black focus:outline-none bg-white placeholder-gray-800 font-medium"
                  onChange={handleSearch}
                />
              </div>
            )}

            {!session ? (
              <>
                <Link href="/auth/login" className="block py-2 hover:bg-blue-700 px-4 rounded">
                  Login
                </Link>
                <Link href="/auth/register" className="block py-2 hover:bg-blue-700 px-4 rounded">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 hover:bg-blue-700 px-4 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
