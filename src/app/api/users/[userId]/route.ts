import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Helper function to get the authenticated user ID from the request
function getAuthenticatedUserId(req: NextRequest): number | null {
  const authCookie = req.cookies.get("auth-storage");
  
  if (!authCookie?.value) {
    return null;
  }
  
  try {
    const authData = JSON.parse(decodeURIComponent(authCookie.value));
    return authData.state?.userId || null;
  } catch (error) {
    console.error("Error parsing auth cookie:", error);
    return null;
  }
}

// GET /api/users/[userId] - Get user data
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const userIdNum = parseInt(userId);
    
    if (isNaN(userIdNum)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }
    
    // Check if user is authorized to access this data
    const authenticatedUserId = getAuthenticatedUserId(req);
    if (!authenticatedUserId || authenticatedUserId !== userIdNum) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }
    
    const userData = await db
      .select({
        id: users.id,
        name: users.name,
        pin: users.pin,
        points: users.points,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userIdNum))
      .limit(1);
    
    if (!userData.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(userData[0]);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[userId] - Update user data
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const userIdNum = parseInt(userId);
    
    if (isNaN(userIdNum)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }
    
    // Check if user is authorized to update this data
    const authenticatedUserId = getAuthenticatedUserId(req);
    if (!authenticatedUserId || authenticatedUserId !== userIdNum) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const updateData: { name?: string; pin?: string } = {};
    
    // Validate and add fields to update
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return NextResponse.json(
          { error: "Name must be a non-empty string" },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }
    
    if (body.pin !== undefined) {
      if (typeof body.pin !== "string" || !/^\d{4}$/.test(body.pin)) {
        return NextResponse.json(
          { error: "PIN must be a 4-digit string" },
          { status: 400 }
        );
      }
      updateData.pin = body.pin;
    }
    
    // Ensure we have something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid update fields provided" },
        { status: 400 }
      );
    }
    
    // Verify user exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userIdNum))
      .limit(1);
    
    if (!existingUser.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Perform update
    await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userIdNum));
    
    // Return updated user data
    const updatedUser = await db
      .select({
        id: users.id,
        name: users.name,
        pin: users.pin,
        points: users.points,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userIdNum))
      .limit(1);
    
    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json(
      { error: "Failed to update user data" },
      { status: 500 }
    );
  }
} 