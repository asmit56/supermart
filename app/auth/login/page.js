'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        role,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        // Redirect based on role
        const redirectPath = role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard';
        router.push(redirectPath);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">S</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">SuperMart</h1>
            <p className="text-gray-600">Welcome back!</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6 flex gap-3">
            <motion.button
              onClick={() => setRole('buyer')}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                role === 'buyer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              👤 Buyer
            </motion.button>
            <motion.button
              onClick={() => setRole('seller')}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                role === 'seller'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏪 Seller
            </motion.button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition bg-white text-black placeholder-gray-800 font-medium"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition bg-white text-black placeholder-gray-800 font-medium"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full border-2 border-gray-300 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition">
              🔵 Login with Facebook
            </button>
            <button className="w-full border-2 border-gray-300 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition">
              🔴 Login with Google
            </button>
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center text-gray-700">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">
              Sign up now
            </Link>
          </div>
        </div>

        {/* Demo Credentials
        <motion.div
          className="mt-6 bg-white bg-opacity-90 rounded-lg p-4 text-sm text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-bold mb-2">Demo Credentials:</p>
          <p>📧 buyer@demo.com / demo123</p>
          <p>🏪 seller@demo.com / demo123</p>
        </motion.div> */}
      </motion.div>
    </div>
  );
}
