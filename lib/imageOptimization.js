import imageCompression from 'browser-image-compression';

/**
 * Optimize an image file by compressing and resizing
 * @param {File} file - The image file to optimize
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - The compressed file
 */
export async function optimizeImage(file, options = {}) {
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    quality: 0.8,
    ...options,
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    return compressedFile;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return file; // Return original file if compression fails
  }
}

/**
 * Calculate compression ratio and size reduction
 * @param {number} originalSize - Original file size in bytes
 * @param {number} compressedSize - Compressed file size in bytes
 * @returns {Object} - Object with sizes and ratio info
 */
export function calculateCompressionStats(originalSize, compressedSize) {
  const originalMB = (originalSize / 1024 / 1024).toFixed(2);
  const compressedMB = (compressedSize / 1024 / 1024).toFixed(2);
  const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(0);

  return {
    originalMB,
    compressedMB,
    reduction,
  };
}

/**
 * Get blur hash placeholder string for progressive image loading
 * @param {string} color - Base color hex code
 * @returns {string} - SVG data URL for placeholder
 */
export function createBlurPlaceholder(color = '#e5e7eb') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
      <rect width="10" height="10" fill="${color}"/>
      <filter id="blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
      </filter>
      <rect width="10" height="10" fill="${color}" filter="url(#blur)"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate image quality and suggest optimization
 * @param {File} file - The image file to validate
 * @returns {Object} - Validation result
 */
export async function validateImageQuality(file) {
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB limit
  const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  return {
    isValid: file.size <= maxSizeBytes && supportedFormats.includes(file.type),
    size: file.size,
    maxSize: maxSizeBytes,
    type: file.type,
    needsCompression: file.size > 1 * 1024 * 1024, // > 1MB
  };
}
