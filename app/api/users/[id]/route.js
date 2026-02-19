import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const user = await User.findById(params.id).select('-password');

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return Response.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    ).select('-password');

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
