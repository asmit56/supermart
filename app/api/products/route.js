import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    await connectToDatabase();

    let query = { isActive: true };

    if (sellerId) {
      query.sellerId = sellerId;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query)
      .populate('sellerId', 'name storeName')
      .sort({ createdAt: -1 });

    return Response.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const name = formData.get('name');
    const description = formData.get('description');
    const price = formData.get('price');
    const originalPrice = formData.get('originalPrice');
    const category = formData.get('category');
    const sellerId = formData.get('sellerId');

    if (!name || !description || !price || !category || !sellerId) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Extract attachments
    const attachments = [];
    let index = 0;
    while (formData.has(`attachment_${index}`)) {
      const file = formData.get(`attachment_${index}`);
      if (file && file.size > 0) {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        attachments.push({
          name: file.name,
          type: file.type,
          size: file.size,
          data: `data:${file.type};base64,${base64}`,
        });
      }
      index++;
    }

    // Use first attachment as main image if available
    const mainImage = attachments.length > 0 && attachments[0].type.startsWith('image/') 
      ? attachments[0].data 
      : null;

    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      category,
      sellerId,
      image: mainImage || 'https://via.placeholder.com/300x300?text=Product',
      images: attachments.map(att => att.data),
      sku: `${category}-${Date.now()}`,
    });

    await newProduct.save();

    return Response.json(
      {
        message: 'Product created successfully',
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return Response.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}
