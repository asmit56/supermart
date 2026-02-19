import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { getToken } from 'next-auth/jwt';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const token = await getToken({ req: request });

    // Only sellers can add FAQs to their products
    if (!token || token.role !== 'seller') {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { question, answer } = await request.json();

    if (!question || !answer) {
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

    // Verify seller owns this product
    if (product.sellerId.toString() !== token.sub) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Add the FAQ
    const newFaq = {
      question,
      answer,
      helpful: 0,
      createdAt: new Date(),
    };

    product.faqs.push(newFaq);
    await product.save();
    await product.populate('sellerId', 'name storeName storeDescription phone address city');

    return Response.json(product);
  } catch (error) {
    console.error('Error adding FAQ:', error);
    return Response.json(
      { error: 'Failed to add FAQ', details: error.message },
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

    return Response.json(product.faqs || []);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return Response.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const token = await getToken({ req: request });

    if (!token || token.role !== 'seller') {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { faqId } = await request.json();
    await connectToDatabase();

    const product = await Product.findById(id);
    if (!product) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.sellerId.toString() !== token.sub) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    product.faqs = product.faqs.filter(faq => faq._id.toString() !== faqId);
    await product.save();
    await product.populate('sellerId', 'name storeName storeDescription phone address city');

    return Response.json(product);
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return Response.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}
