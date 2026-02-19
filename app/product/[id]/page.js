'use client'; // Enable client-side React features (hooks, events)

// Import navigation and routing hooks from Next.js
import { useParams, useRouter } from 'next/navigation';
// Import React hooks for state management and side effects
import { useEffect, useState } from 'react';
// Import Link for client-side navigation without page refresh
import Link from 'next/link';
// Import navigation bar component
import Navbar from '@/app/components/Navbar';
// Import Toast notification component
import Toast from '@/app/components/Toast';
// Import Framer Motion for animations
import { motion } from 'framer-motion';
// Import NextAuth.js for user session management
import { useSession } from 'next-auth/react';

export default function ProductPage() {
  // Get URL parameters (dynamic route: /product/[id])
  const params = useParams();
  const router = useRouter();
  const { id } = params; // Extract product ID from URL
  
  // Get current logged-in user session (null if not logged in)
  const { data: session } = useSession();
  
  // STATE MANAGEMENT - Stores component data
  const [product, setProduct] = useState(null); // Stores fetched product details
  const [quantity, setQuantity] = useState(1); // Tracks user's selected quantity (1-10)
  const [loading, setLoading] = useState(true); // Shows loading spinner while fetching data
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Tracks which image is displayed in carousel
  const [showReviewForm, setShowReviewForm] = useState(false); // Toggle review form visibility
  const [toast, setToast] = useState(null); // Toast notification state
  const [reviewData, setReviewData] = useState({
    rating: 5, // Star rating (1-5)
    title: '', // Brief review title
    comment: '', // Detailed comment
  });

  // STOCK SAFEGUARD - Convert stock to number to prevent type errors
  // Handles cases where stock might be undefined, null, or a string
  const stock = product ? (parseInt(product.stock) || 0) : 0;

  // FETCH PRODUCT DATA - Runs once when component mounts
  // Fetches product details from API based on product ID in URL
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // API call to get product data by ID
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data); // Store product data in state
      } catch (error) {
        // Log error to console if fetch fails
        console.error('Error fetching product:', error);
      } finally {
        // Set loading to false after fetch completes (success or error)
        setLoading(false);
      }
    };

    // Only fetch if product ID exists
    if (id) {
      fetchProduct();
    }
  }, [id]); // Re-run effect if product ID changes

  // HANDLE ADD TO CART - Adds current product to shopping cart
  const handleAddToCart = () => {
    // If user not logged in, redirect to login page
    if (!session) {
      router.push('/auth/login');
      return;
    }

    // Get existing cart from browser's local storage (JSON string)
    // If cart doesn't exist, default to empty array
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if this product is already in the cart
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      // If product exists, increase its quantity
      existingItem.quantity += quantity;
      setToast({
        message: `✅ Added ${quantity} more to cart!`,
        type: 'success',
      });
    } else {
      // If product is new, add it to cart with selected quantity
      cart.push({ ...product, quantity });
      setToast({
        message: `✅ ${product.name} added to cart!`,
        type: 'success',
      });
    }

    // Save updated cart back to local storage as JSON string
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  // HANDLE ADD REVIEW - Submits customer review for this product
  const handleAddReview = async (e) => {
    // Prevent form from submitting the traditional way
    e.preventDefault();

    // If user not logged in, redirect to login page
    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      // Send review data to API endpoint
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST', // POST request - creating new data
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id, // Current user's ID
          userName: session.user.name, // Current user's name
          rating: Number(reviewData.rating), // Convert rating to number (1-5 stars)
          title: reviewData.title, // Review title
          comment: reviewData.comment, // Review comment
        }),
      });

      // If review submitted successfully
      if (res.ok) {
        // Get updated product with new review data
        const updatedProduct = await res.json();
        setProduct(updatedProduct); // Update product state with new review
        // Reset form fields to default values
        setReviewData({ rating: 5, title: '', comment: '' });
        // Hide review form after successful submission
        setShowReviewForm(false);
        // Confirm to user that review was added
        alert('Review added successfully!');
      }
    } catch (error) {
      // Log error if review submission fails
      console.error('Error adding review:', error);
      alert('Error adding review');
    }
  };

  // LOADING STATE - Show spinner while fetching product data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Animated spinning circle loader */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ERROR STATE - Show message if product doesn't exist
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          {/* Link back to home page */}
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // CALCULATE DISCOUNT PERCENTAGE - Shows savings compared to original price
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // SETUP IMAGE/VIDEO CAROUSEL - Get attachments or fallback to single image
  const attachments = (product.images && product.images.length > 0 ? product.images : []) ||
    (product.image ? [product.image] : []);
  // Get the current image/video being displayed in carousel
  const currentAttachment = attachments[currentImageIndex] || product.image;
  // Check if current attachment is a video (has video MIME type in base64 string)
  const isVideo = currentAttachment && currentAttachment.includes('data:video/');

  // CALCULATE AVERAGE RATING - Average of all review ratings
  const avgRating = product.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : 0;

  // COUNT REVIEWS BY RATING - Shows how many reviews for each star count (1-5)
  const ratingCounts = {
    5: product.reviews?.filter(r => r.rating === 5).length || 0, // 5-star reviews
    4: product.reviews?.filter(r => r.rating === 4).length || 0, // 4-star reviews
    3: product.reviews?.filter(r => r.rating === 3).length || 0, // 3-star reviews
    2: product.reviews?.filter(r => r.rating === 2).length || 0, // 2-star reviews
    1: product.reviews?.filter(r => r.rating === 1).length || 0, // 1-star reviews
  };

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
        {/* BREADCRUMB NAVIGATION - Shows current page location (Home > Category > Product) */}
        <motion.div className="mb-8 text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Home link */}
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span> / {product.category} / </span>
          {/* Current product name */}
          <span className="text-gray-800 font-semibold">{product.name}</span>
        </motion.div>

        {/* MAIN PRODUCT LAYOUT - 2 column grid: images on left, details on right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* LEFT COLUMN - PRODUCT IMAGE CAROUSEL */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* STOCK STATUS BADGE - Shows if out of stock with prominent styling */}
            {stock === 0 && (
              <div className="w-full mb-4 px-4 py-3 bg-red-100 border-2 border-red-500 rounded-lg text-center">
                <span className="text-red-700 font-bold text-lg">🚫 Out of Stock</span>
              </div>
            )}

            {/* Main image display area with aspect ratio 1:1 (square) */}
            <div className={`w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4 relative group ${stock === 0 ? 'opacity-70' : ''}`}>
              {/* If current attachment exists and is NOT a video, display as image */}
              {currentAttachment && !isVideo ? (
                <img
                  src={currentAttachment}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    // If image fails to load, show placeholder
                    e.target.style.display = 'none';
                  }}
                />
              ) : currentAttachment && isVideo ? (
                /* If current attachment is a video, display video player with controls */
                <video
                  src={currentAttachment}
                  controls // Shows play/pause/volume controls
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                /* If no image/video available, show placeholder text */
                <div className="text-center">
                  <span className="text-gray-500 text-lg font-semibold">No Image Available</span>
                  <p className="text-gray-400 text-sm mt-2">Product image will appear here</p>
                </div>
              )}

              {/* CAROUSEL NAVIGATION - Previous/Next buttons (only show if multiple images) */}
              {attachments.length > 1 && (
                <>
                  {/* NEXT BUTTON - Moves to next image in carousel */}
                  <button
                    // Circular logic: when at last image, go to first image
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1 + attachments.length) % attachments.length)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
                  >
                    ‹ {/* Left arrow */}
                  </button>
                  {/* PREVIOUS BUTTON - Moves to previous image in carousel */}
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1) % attachments.length)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
                  >
                    › {/* Right arrow */}
                  </button>
                </>
              )}
            </div>

            {/* THUMBNAIL SELECTOR - Shows numbered buttons to navigate images directly */}
            {attachments.length > 1 && (
              <div className="flex gap-2 w-full overflow-x-auto">
                {/* Map through each attachment to create a numbered button */}
                {attachments.map((_, idx) => (
                  <button
                    key={idx}
                    // Click to jump directly to this image
                    onClick={() => setCurrentImageIndex(idx)}
                    // Highlight current image with blue color
                    className={`text-xs px-3 py-2 rounded transition flex-shrink-0 ${
                      idx === currentImageIndex
                        ? 'bg-blue-600 text-white' // Active/selected thumbnail
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Inactive thumbnail
                    }`}
                  >
                    {idx + 1} {/* Display number starting from 1 */}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN - PRODUCT DETAILS AND ACTIONS */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* PRODUCT INFO SECTION */}
            <div>
              {/* Category badge and rating summary */}
              <div className="mb-3 flex items-center gap-4">
                {/* Category badge */}
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                  {product.category}
                </span>
                {/* Star rating and review count */}
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="text-sm text-gray-600">({product.reviews?.length || 0} reviews)</span>
                </div>
              </div>

              {/* PRODUCT TITLE */}
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              {/* SELLER INFO - Shows who is selling this product */}
              <p className="text-gray-600 text-sm">Sold by: {product.sellerId?.storeName || product.sellerId?.name}</p>
            </div>

            {/* PRICE SECTION - Displays current price, original price, and discount */}
            <div className="border-t border-b py-4">
              <div className="flex items-center gap-4 mb-3">
                {/* CURRENT PRICE - Bold and large for emphasis */}
                <span className="text-4xl font-bold text-blue-600">₹{product.price}</span>
                {/* ORIGINAL PRICE AND DISCOUNT (only if on sale) */}
                {product.originalPrice && (
                  <>
                    {/* Original price with strikethrough to show savings */}
                    <span className="text-2xl text-gray-400 line-through">₹{product.originalPrice}</span>
                    {/* Discount percentage badge (red background) */}
                    {discount > 0 && (
                      <span className="text-lg font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                        -{discount}% {/* Shows how much user saves */}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* STOCK STATUS - Shows if product is available */}
              {stock > 0 ? (
                <p className="text-green-700 font-semibold">✓ In Stock ({stock} available)</p>
              ) : (
                <p className="text-red-700 font-semibold">Out of Stock</p>
              )}
            </div>

            {/* DESCRIPTION SECTION */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">About this item</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* QUANTITY AND ACTION BUTTONS SECTION */}
            <div className="space-y-4">
              {/* QUANTITY SELECTOR - Allows user to choose how many to buy (1-10) */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Quantity:</label>
                {/* QUANTITY CONTROLS - Mobile Optimized with +/- buttons and input field */}
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border-2 border-gray-300 focus-within:border-blue-600">
                  {/* MINUS BUTTON - Decrease quantity */}
                  <motion.button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold text-lg md:text-xl rounded-lg transition"
                    whileTap={{ scale: 0.95 }}
                  >
                    −
                  </motion.button>

                  {/* NUMBER INPUT FIELD - Manual entry allowed */}
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      // Parse input value to integer, default to 1 if invalid
                      const val = parseInt(e.target.value) || 1;
                      // Limit quantity: minimum 1, maximum 10 - user cannot exceed limit
                      setQuantity(Math.min(10, Math.max(1, val)));
                    }}
                    onBlur={(e) => {
                      // Extra safeguard - if user somehow enters invalid value, reset to 1
                      const val = parseInt(e.target.value) || 1;
                      if (val > 10) setQuantity(10);
                      if (val < 1) setQuantity(1);
                    }}
                    min="1"
                    max="10"
                    className="flex-grow text-center px-3 py-2 md:py-3 bg-white text-black font-bold text-lg md:text-xl border-0 focus:outline-none rounded"
                    placeholder="1-10"
                  />

                  {/* PLUS BUTTON - Increase quantity */}
                  <motion.button
                    type="button"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold text-lg md:text-xl rounded-lg transition"
                    whileTap={{ scale: 0.95 }}
                  >
                    +
                  </motion.button>
                </div>

                {/* QUANTITY LIMIT REMINDER - Shows quantity constraints */}
                <p className="text-xs text-gray-600">Maximum 10 items per order</p>
              </div>

              {/* ACTION BUTTONS - Add to Cart and Buy Now */}
              <div className="grid grid-cols-2 gap-4">
                {/* ADD TO CART BUTTON */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={stock === 0} // Disable if out of stock
                  className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
                  whileHover={{ scale: 1.05 }} // Framer Motion animation on hover
                  whileTap={{ scale: 0.95 }} // Animation when clicked
                >
                  🛒 Add to Cart
                </motion.button>
                {/* BUY NOW BUTTON - Placeholder for checkout flow */}
                <motion.button
                  className="bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⚡ Buy Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* REVIEWS & FAQS SECTION - 3 column layout: 2 cols for reviews, 1 col for FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* REVIEWS COLUMN - Takes up 2 columns on large screens */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* HEADER - Title and "Write a Review" button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
              {/* TOGGLE REVIEW FORM BUTTON - Shows/hides review submission form */}
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                + Write a Review
              </button>
            </div>

            {/* RATING SUMMARY - Shows average rating and distribution of all reviews */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="border-b pb-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  {/* AVERAGE RATING DISPLAY */}
                  <div>
                    <div className="flex items-center gap-2">
                      {/* Large average rating number */}
                      <span className="text-4xl font-bold text-gray-800">{avgRating}</span>
                      {/* Star symbols */}
                      <span className="text-yellow-400 text-2xl">★★★★★</span>
                    </div>
                    {/* Total review count */}
                    <p className="text-gray-600 text-sm">{product.reviews.length} reviews</p>
                  </div>

                  {/* RATING DISTRIBUTION CHART - Shows breakdown of ratings (5★, 4★, etc) */}
                  <div className="flex-1 space-y-1">
                    {/* Loop through each star rating (5, 4, 3, 2, 1) */}
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2 text-sm">
                        {/* Star label (e.g., "5★") */}
                        <span className="w-4">{stars}★</span>
                        {/* Bar chart showing percentage of reviews with this rating */}
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          {/* Filled portion of bar proportional to number of reviews */}
                          <div
                            className="h-full bg-yellow-400"
                            // Calculate percentage: (count of this rating / total reviews) * 100
                            style={{ width: `${(ratingCounts[stars] / product.reviews.length) * 100}%` }}
                          ></div>
                        </div>
                        {/* Number of reviews with this rating */}
                        <span className="w-8 text-right text-gray-600">{ratingCounts[stars]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* REVIEW SUBMISSION FORM - Shows when user clicks "Write a Review" */}
            {showReviewForm && (
              <motion.form
                onSubmit={handleAddReview}
                className="border rounded-lg p-4 mb-6 bg-gray-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="font-bold text-gray-800 mb-4">Share your thoughts</h3>

                {/* RATING SELECTOR - 5 clickable stars to select rating (1-5) */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {/* Map through 1-5 to create 5 clickable stars */}
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        // Click to set rating to this star value
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        // Gold color if star is <= selected rating, gray otherwise
                        className={`text-3xl transition ${
                          star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* REVIEW TITLE INPUT - Brief summary of review */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Review Title</label>
                  <input
                    type="text"
                    placeholder="Summarize your experience"
                    value={reviewData.title}
                    // Update review title as user types
                    onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white text-black placeholder-gray-800 font-medium"
                    required
                  />
                </div>

                {/* REVIEW COMMENT INPUT - Detailed review text */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Review Comment</label>
                  <textarea
                    placeholder="Tell us more about your experience with this product"
                    value={reviewData.comment}
                    // Update review comment as user types
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-24 bg-white text-black placeholder-gray-800 font-medium"
                    required
                  ></textarea>
                </div>

                {/* FORM BUTTONS */}
                <div className="flex gap-4">
                  {/* SUBMIT BUTTON - Sends review to database */}
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Submit Review
                  </button>
                  {/* CANCEL BUTTON - Hides review form without saving */}
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}

            {/* ALL REVIEWS LIST - Shows all customer reviews for this product */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                // Display reviews in reverse order (newest first)
                product.reviews.slice().reverse().map((review, idx) => (
                  <motion.div
                    key={idx}
                    className="border rounded-lg p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* REVIEW HEADER - Title and reviewer info */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        {/* Review title */}
                        <p className="font-bold text-gray-800">{review.title}</p>
                        {/* Rating stars and reviewer name */}
                        <div className="flex items-center gap-2">
                          {/* Display filled stars (★) for rating, empty stars (☆) for remainder */}
                          <span className="text-yellow-400">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </span>
                          {/* Show who wrote the review */}
                          <span className="text-sm text-gray-600">by {review.userName}</span>
                        </div>
                      </div>
                      {/* Review date formatted as readable text (MM/DD/YYYY) */}
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {/* REVIEW COMMENT - Detailed review text */}
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </motion.div>
                ))
              ) : (
                // Show this message if no reviews exist yet
                <p className="text-center text-gray-600">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </motion.div>

          {/* FAQS COLUMN - Frequently Asked Questions sidebar (1 column on large screens) */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y:20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>

            {/* DISPLAY FAQS OR EMPTY STATE */}
            {product.faqs && product.faqs.length > 0 ? (
              // If FAQs exist, display them
              <div className="space-y-3">
                {/* Map through each FAQ item */}
                {product.faqs.map((faq, idx) => (
                  <motion.div
                    key={idx}
                    className="border rounded-lg p-3 bg-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {/* FAQ QUESTION */}
                    <p className="font-semibold text-gray-800 text-sm mb-2">{faq.question}</p>
                    {/* FAQ ANSWER */}
                    <p className="text-gray-700 text-sm">{faq.answer}</p>
                    {/* HELPFUL BUTTON - Allows users to mark FAQ as helpful */}
                    <button className="text-xs text-blue-600 hover:text-blue-700 mt-2">
                      Helpful ({faq.helpful})
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Show this if seller hasn't added any FAQs yet
              <p className="text-center text-gray-600 text-sm">No FAQs available yet</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
