'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import ProductCard from '@/app/components/ProductCard';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';

export default function SellerProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    stock: '',
    attachments: [],
  });
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/products?sellerId=${session.user.id}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchProducts();
    }
  }, [session?.user?.id]);

  const handleAddAttachments = async (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
      return validTypes.includes(file.type);
    });

    const newAttachments = [...formData.attachments];
    const newPreviews = [...attachmentPreviews];

    for (const file of validFiles) {
      if (newAttachments.length < 10) { // Limit to 10 files
        try {
          let processedFile = file;
          const isImage = file.type.startsWith('image/');

          // Compress images
          if (isImage) {
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
              quality: 0.8,
            };
            processedFile = await imageCompression(file, options);
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            const originalSize = (file.size / 1024 / 1024).toFixed(2);
            const compressedSize = (processedFile.size / 1024 / 1024).toFixed(2);
            const saved = isImage ? ((1 - processedFile.size / file.size) * 100).toFixed(0) : 0;

            newPreviews.push({
              name: file.name,
              type: isImage ? 'image' : 'video',
              preview: event.target.result,
              originalSize,
              compressedSize,
              saved: isImage ? saved : 0,
            });
            setAttachmentPreviews([...newPreviews]);
          };
          reader.readAsDataURL(processedFile);
          newAttachments.push(processedFile);
        } catch (error) {
          console.error('Error processing file:', error);
        }
      }
    }

    setFormData({ ...formData, attachments: newAttachments });
    e.target.value = ''; // Reset input
  };

  const removeAttachment = (index) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    const newPreviews = attachmentPreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, attachments: newAttachments });
    setAttachmentPreviews(newPreviews);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsSubmitting(true);

    try {
      // VALIDATION - Check all required fields
      if (!formData.name.trim()) {
        setFormError('❌ Product name is required');
        setIsSubmitting(false);
        return;
      }

      if (!formData.description.trim()) {
        setFormError('❌ Product description is required');
        setIsSubmitting(false);
        return;
      }

      if (!formData.price || Number(formData.price) <= 0) {
        setFormError('❌ Price must be greater than 0');
        setIsSubmitting(false);
        return;
      }

      if (!formData.stock || Number(formData.stock) < 0) {
        setFormError('❌ Stock quantity is required and must be 0 or higher');
        setIsSubmitting(false);
        return;
      }

      if (formData.attachments.length === 0) {
        setFormError('❌ Please add at least one image or video');
        setIsSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', Number(formData.price));
      formDataToSend.append('originalPrice', formData.originalPrice ? Number(formData.originalPrice) : null);
      formDataToSend.append('stock', Number(formData.stock));
      formDataToSend.append('category', formData.category);
      formDataToSend.append('sellerId', session?.user?.id);

      // Add attachments
      formData.attachments.forEach((file, index) => {
        formDataToSend.append(`attachment_${index}`, file);
      });

      const res = await fetch('/api/products', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        setProducts([data.product, ...products]);
        setFormSuccess('✅ Product added successfully!');
        // RESET FORM AFTER SUCCESS
        setFormData({
          name: '',
          description: '',
          price: '',
          originalPrice: '',
          category: 'Electronics',
          stock: '',
          attachments: [],
        });
        setAttachmentPreviews([]);
        setShowForm(false);
        // Clear success message after 2 seconds
        setTimeout(() => setFormSuccess(''), 2000);
      } else {
        setFormError(`❌ Error: ${data.error || 'Failed to create product'}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setFormError(`❌ Error: ${error.message || 'Something went wrong'}`);
    } finally {
      setIsSubmitting(false);
    }
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Products</h1>
            <p className="text-gray-600 mt-2">Manage and add new products to your store</p>
          </div>
          <motion.button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Add New Product
          </motion.button>
        </motion.div>

        {/* Add Product Form */}
        {showForm && (
          <motion.div
            className="bg-white rounded-lg shadow-md p-6 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>

            {/* ERROR MESSAGE - Shows if form submission fails */}
            {formError && (
              <div className="mb-4 p-4 bg-red-100 border-2 border-red-500 rounded-lg">
                <p className="text-red-700 font-semibold">{formError}</p>
              </div>
            )}

            {/* SUCCESS MESSAGE - Shows after successful submission */}
            {formSuccess && (
              <div className="mb-4 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
                <p className="text-green-700 font-semibold">{formSuccess}</p>
              </div>
            )}

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white text-black placeholder-gray-800 font-medium"
                required
              />

              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none text-black focus:border-blue-600 bg-white font-medium"
              >
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Food & Groceries</option>
                <option>Home & Garden</option>
                <option>Books</option>
                <option>Other</option>
              </select>

              <input
                type="number"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white text-black placeholder-gray-800 font-medium"
                required
              />

              <input
                type="number"
                placeholder="Original Price (₹)"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white text-black placeholder-gray-800 font-medium"
              />

              <input
                type="number"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                min="0"
                step="1"
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white text-black placeholder-gray-800 font-medium"
                required
              />

              <textarea
                placeholder="Product Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="md:col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[100px] bg-white text-black placeholder-gray-800 font-medium"
                required
              />

              {/* File Upload Section */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Add Photos & Videos ({formData.attachments.length}/10)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleAddAttachments}
                    className="hidden"
                    id="attachments-input"
                  />
                  <label htmlFor="attachments-input" className="cursor-pointer">
                    <div className="text-gray-600">
                      <p className="font-semibold">Click to upload or drag files here</p>
                      <p className="text-sm mt-1">Supports: JPG, PNG, GIF, WebP, MP4, WebM, MOV</p>
                      <p className="text-xs text-gray-500 mt-1">Max 10 files per product</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Attachments Preview */}
              {attachmentPreviews.length > 0 && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Selected Attachments ({attachmentPreviews.length}/10)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {attachmentPreviews.map((attachment, index) => (
                      <div key={index} className="relative group">
                        <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                          {attachment.type === 'image' ? (
                            <>
                              <img
                                src={attachment.preview}
                                alt={attachment.name}
                                className="w-full h-full object-cover"
                              />
                              {attachment.saved > 0 && (
                                <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
                                  -{attachment.saved}%
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                              <div className="text-center">
                                <div className="text-white text-xl mb-2">▶</div>
                                <p className="text-white text-xs">Video</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                        <div className="mt-1">
                          <p className="text-xs text-gray-600 truncate font-semibold">{attachment.name}</p>
                          {attachment.type === 'image' && (
                            <p className="text-xs text-gray-500">
                              {attachment.compressedSize}MB (from {attachment.originalSize}MB)
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '⏳ Adding Product...' : '+ Add Product'}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setShowForm(false);
                    setFormError('');
                    setFormSuccess('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Products List */}
        {products.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-md p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-6">Start adding products to build your store</p>
            <motion.button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              whileHover={{ scale: 1.05 }}
            >
              Add Your First Product
            </motion.button>
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
                <ProductCard product={product} isSellerView={true} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
