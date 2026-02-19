import mongoose from 'mongoose';

export async function GET(request) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connection URI:', mongoUri?.substring(0, 50) + '...');

    if (!mongoUri) {
      return Response.json(
        {
          success: false,
          error: 'MONGODB_URI not set in environment',
        },
        { status: 500 }
      );
    }

    // Test direct connection
    const conn = await mongoose.connect(mongoUri);
    
    return Response.json({
      success: true,
      message: 'MongoDB connected',
      ready: conn.connection.readyState === 1,
    });
  } catch (error) {
    console.error('Connection error:', error.message);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
