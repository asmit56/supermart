'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar({ isOpen, onClose }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { label: 'Dashboard', href: '/seller/dashboard', icon: '📊' },
    { label: 'Products', href: '/seller/products', icon: '📦' },
    { label: 'Orders', href: '/seller/orders', icon: '📋' },
    { label: 'Analytics', href: '/seller/analytics', icon: '📈' },
    { label: 'Settings', href: '/seller/settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-16 w-64 bg-gray-900 text-white h-screen shadow-lg z-50 md:relative md:top-0 md:h-auto md:flex md:flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transition-transform duration-300`}
        initial={false}
        animate={{ x: isOpen ? 0 : -256 }}
      >
        <nav className="flex-1 p-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition mb-2 text-gray-300 hover:text-white"
              onClick={() => {
                setActiveMenu(item.label);
                onClose?.();
              }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </motion.div>
    </>
  );
}
