'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  // Auto-close toast after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[type];

  const icon = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  }[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -20, x: 20 }}
        className={`fixed top-20 right-6 ${bgColor} text-white rounded-lg shadow-lg px-4 py-3 max-w-sm z-50`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <p className="font-semibold">{message}</p>
          <button
            onClick={onClose}
            className="ml-auto text-xl hover:opacity-70 transition"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
