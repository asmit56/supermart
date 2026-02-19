import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    console.log('Testing database connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI?.substring(0, 50) + '...');
    
    const conn = await connectToDatabase();
    console.log('Connected successfully');
    
    return Response.json({
      success: true,
      message: 'Database connected successfully',
      status: 'connected',
    });
  } catch (error) {
    console.error('Complete error:', error);
    return Response.json(
      {
        success: false,
        error: error.message,
        type: error.name,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
