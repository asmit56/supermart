import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const product = await Product.findById(id)
      .populate('sellerId', 'name storeName storeDescription phone address city');

    if (!product) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return Response.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return Response.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type');
    let updateData = {};

    if (contentType?.includes('application/json')) {
      updateData = await request.json();
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();

      updateData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
        originalPrice: formData.get('originalPrice') ? Number(formData.get('originalPrice')) : null,
        stock: Number(formData.get('stock')),
        category: formData.get('category'),
      };

      // Handle existing images
      const existingImages = formData.get('existingImages');
      if (existingImages) {
        updateData.images = JSON.parse(existingImages);
      }

      // Extract new attachments
      let index = 0;
      while (formData.has(`attachment_${index}`)) {
        const file = formData.get(`attachment_${index}`);
        if (file && file.size > 0) {
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          const attachmentData = `data:${file.type};base64,${base64}`;
          
          if (!updateData.images) {
            updateData.images = [];
          }
          updateData.images.push(attachmentData);
        }
        index++;
      }

      // Use first image as main image if available
      if (updateData.images && updateData.images.length > 0) {
        const firstImage = updateData.images.find(img => img.includes('image/'));
        if (firstImage) {
          updateData.image = firstImage;
        }
      }
    }

    await connectToDatabase();

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!product) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return Response.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return Response.json(
      { error: 'Failed to update product', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return Response.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return Response.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
