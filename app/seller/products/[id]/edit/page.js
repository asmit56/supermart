'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';

export default function EditProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [loading, setLoading] = useState(true);
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
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (!productId || !session?.user?.id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          router.push('/seller/products');
          return;
        }

        const product = await res.json();

        // Verify seller owns this product
        if (product.sellerId._id !== session.user.id) {
          router.push('/seller/products');
          return;
        }

        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice || '',
          category: product.category,
          stock: product.stock,
          attachments: [],
        });

        if (product.images && product.images.length > 0) {
          setExistingImages(
            product.images.map((img, idx) => ({
              id: `existing-${idx}`,
              data: img,
              isVideo: img.includes('data:video/'),
            }))
          );
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, session?.user?.id, router]);

  const handleAddAttachments = async (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
      return validTypes.includes(file.type);
    });

    const newAttachments = [...formData.attachments];
    const newPreviews = [...attachmentPreviews];
    const totalFiles = existingImages.length + newAttachments.length + validFiles.length;

    if (totalFiles > 10) {
      alert('Maximum 10 files allowed. You already have ' + (existingImages.length + newAttachments.length) + ' files.');
      return;
    }

    for (const file of validFiles) {
      if (newAttachments.length < 10) {
        try {
          let processedFile = file;
          const isImage = file.type.startsWith('image/');

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
    e.target.value = '';
  };

  const removeNewAttachment = (index) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    const newPreviews = attachmentPreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, attachments: newAttachments });
    setAttachmentPreviews(newPreviews);
  };

  const removeExistingImage = (id) => {
    if (window.confirm('Remove this image from the product?')) {
      setExistingImages(existingImages.filter(img => img.id !== id));
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', Number(formData.price));
      formDataToSend.append('originalPrice', formData.originalPrice ? Number(formData.originalPrice) : null);
      formDataToSend.append('stock', Number(formData.stock));
      formDataToSend.append('category', formData.category);

      // Add existing images to keep
      const existingImageData = existingImages.map(img => img.data);
      formDataToSend.append('existingImages', JSON.stringify(existingImageData));

      // Add new attachments
      formData.attachments.forEach((file, index) => {
        formDataToSend.append(`attachment_${index}`, file);
      });

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/seller/products');
      } else {
        alert('Error updating product: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update your product information</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleUpdateProduct} className="space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Product Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white text-black placeholder-gray-800 font-medium"
                  required
                />
              </div>

              <textarea
                placeholder="Product Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full mt-4 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[120px] bg-white text-black placeholder-gray-800 font-medium"
                required
              />
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Current Media</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                        {!image.isVideo ? (
                          <img
                            src={image.data}
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
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
                        onClick={() => removeExistingImage(image.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Attachments */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Media</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleAddAttachments}
                  className="hidden"
                  id="edit-attachments-input"
                />
                <label htmlFor="edit-attachments-input" className="cursor-pointer">
                  <div className="text-gray-600">
                    <p className="font-semibold">Click to upload or drag files here</p>
                    <p className="text-sm mt-1">Supports: JPG, PNG, GIF, WebP, MP4, WebM, MOV</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Max 10 files total. You have {existingImages.length + attachmentPreviews.length} file(s)
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* New Attachments Preview */}
            {attachmentPreviews.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Attachments ({attachmentPreviews.length})
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
                        onClick={() => removeNewAttachment(index)}
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

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Update Product
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
