import { NextRequest, NextResponse } from 'next/server';
import { verifyUserByPin } from '@/lib/db/auth';
import { z } from 'zod';

// Schema to validate the request body
const loginSchema = z.object({
  userId: z.number().positive("User ID must be positive"),
  pin: z.string().length(4, "PIN must be exactly 4 digits").regex(/^\d{4}$/, "PIN must contain only digits"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const validatedData = loginSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data', 
          details: validatedData.error.format() 
        },
        { status: 400 }
      );
    }

    // Verify the user ID and PIN
    const { userId, pin } = validatedData.data;
    const result = await verifyUserByPin(userId, pin);

    // Return the authentication result
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        userId: userId,
        name: result.name
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID or PIN' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 