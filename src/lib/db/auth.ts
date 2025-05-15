import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, max } from "drizzle-orm";

// Create a new user with name and PIN
export async function createUser(name: string, pin: string): Promise<number> {
  // Create the user
  const result = await db
    .insert(users)
    .values({
      name,
      pin,
      isActive: true,
    })
    .returning({ id: users.id });

  if (!result.length) {
    throw new Error("Failed to create user");
  }

  return result[0].id;
}

// Verify user by ID and PIN
export async function verifyUserByPin(
  userId: number,
  pin: string
): Promise<{ success: boolean; name?: string }> {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      pin: users.pin,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!result.length) {
    return { success: false };
  }

  const user = result[0];

  if (user.pin !== pin) {
    return { success: false };
  }

  return {
    success: true,
    name: user.name,
  };
}

// Get user info by ID
export async function getUserById(
  userId: number
): Promise<{ id: number; name: string } | null> {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!result.length) {
    return null;
  }

  return result[0];
}

// Get next user ID (for showing during registration)
export async function getNextUserId(): Promise<number> {
  // Get the highest user ID in the system
  const result = await db
    .select({
      maxId: max(users.id),
    })
    .from(users);

  // Return next ID (current max + 1), or 1 if no users exist
  return (result[0]?.maxId || 0) + 1;
}
