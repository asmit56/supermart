import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcryptjs from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password, confirmPassword, role } = await request.json();

    // Validate input
    if (!name || !email || !password || !confirmPassword || !role) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return Response.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected');

    // Check if user already exists
    console.log('Checking if user exists...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return Response.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create user
    console.log('Creating user...');
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    console.log('User saved successfully');

    return Response.json(
      {
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { error: 'Registration failed', details: error.message },
      { status: 500 }
    );
  }
}
