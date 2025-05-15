import { NextRequest, NextResponse } from "next/server";
import { createUser, getNextUserId } from "@/lib/db/auth";
import { z } from "zod";

// Schema to validate the request body
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  pin: z
    .string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d{4}$/, "PIN must contain only digits"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const validatedData = registerSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: validatedData.error.format(),
        },
        { status: 400 }
      );
    }

    // Create the user with name and PIN
    const { name, pin } = validatedData.data;
    const userId = await createUser(name, pin);

    // Get the next user ID (for information display)
    const nextId = await getNextUserId();

    // Return the user ID (the one that was just created)
    return NextResponse.json({
      success: true,
      userId,
      name,
    });
  } catch (error) {
    console.error("Error in register API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register user" },
      { status: 500 }
    );
  }
}
