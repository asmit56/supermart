# Image Upload Guidelines for SuperMart

## Image Size Recommendations

### Optimal Image Dimensions

**Product Images:**
- **Display Size**: 800x800px to 1200x1200px
- **Aspect Ratio**: 1:1 (Square) preferred for consistency
- **Min Size**: 400x400px
- **Max Size**: 2048x2048px

**Formats Supported:**
- JPEG (.jpg, .jpeg) - Best for photos
- PNG (.png) - Best for transparency
- WebP (.webp) - Modern, optimized format
- GIF (.gif) - For animations

### Video Guidelines

**Supported Formats:**
- MP4 (.mp4) - Most compatible
- WebM (.webm) - Modern format
- MOV (.mov) - Apple format

**Recommended:**
- Resolution: 720p to 1080p
- File Size: Max 50MB
- Duration: 15-60 seconds recommended

## File Size Limits

### Automatic Optimization

Our system **automatically compresses all images** on upload to ensure:
- ✅ Faster page loading
- ✅ Better performance
- ✅ Reduced bandwidth usage

**Compression Settings:**
```
Maximum Width/Height: 1920px
Quality Level: 80% (good balance)
Max File Size: 1MB (compressed)
Browser Compression: Yes
```

### Pre-Upload Limits

- **Single File Limit**: No hard limit, but recommended max 50MB
- **Files Per Product**: Maximum 10 attachments
- **Formats**: JPEG, PNG, GIF, WebP, MP4, WebM, MOV

## Upload Tips

### For Best Results:

1. **Use High-Quality Source Images**
   - Start with 1200x1200px or larger
   - Use natural, well-lit photos
   - Avoid low-resolution images

2. **Filename Guidelines**
   - Use descriptive names: `product-with-packaging.jpg`
   - Avoid special characters
   - Keep filenames under 50 characters

3. **Compression Before Upload** (Optional)
   - You can pre-compress using:
     - TinyPNG/TinyJPG (online)
     - ImageOptim (Mac)
     - ImageMagick (Linux)
     - Windows Photos app (Windows)

4. **Best Practices**
   - Upload thumbnail first (main product image)
   - Add detail/zoom shots
   - Include product in use (if applicable)
   - Show packaging
   - Add 1-2 videos for premium products

## Example Upload Scenario

**What You Upload:**
- Original file: 8MB JPEG (4000x4000px)

**What Gets Stored:**
- Compressed: ~600KB (1920x1920px at 80% quality)
- You save: ~92% bandwidth
- Your users get: Instant loading

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |

All modern browsers support JPEG, PNG, WebP, and MP4.

## Troubleshooting

### Image Not Showing?
1. Check file format (must be JPG, PNG, GIF, or WebP)
2. Verify file size isn't corrupted
3. Try PNG format if JPEG fails

### Slow Upload?
1. File size too large (>50MB)
2. Video too long or high resolution
3. Check internet connection

### Quality Issues?
1. Use original high-quality images (min 800x800px)
2. Avoid heavily edited or compressed images
3. PNG better for graphics, JPEG for photos

## Questions?

For issues with image uploads, try:
1. Different file format
2. Smaller dimensions
3. Clear browser cache (Ctrl+Shift+Del)
4. Try different browser
