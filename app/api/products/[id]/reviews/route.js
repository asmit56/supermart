import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { userId, userName, rating, title, comment } = await request.json();

    if (!rating || !title || !comment) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await Product.findById(id);
    if (!product) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Add the review
    const newReview = {
      userId,
      userName,
      rating: Number(rating),
      title,
      comment,
      helpful: 0,
      createdAt: new Date(),
    };

    product.reviews.push(newReview);

    // Update average rating
    const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    product.rating = Math.round(avgRating * 10) / 10;

    await product.save();
    await product.populate('sellerId', 'name storeName storeDescription phone address city');

    return Response.json(product);
  } catch (error) {
    console.error('Error adding review:', error);
    return Response.json(
      { error: 'Failed to add review', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const product = await Product.findById(id);
    if (!product) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return Response.json(product.reviews || []);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return Response.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
