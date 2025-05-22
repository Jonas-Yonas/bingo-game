import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Authorization check
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch users with manager role or all users who can be managers
    const managers = await db.user.findMany({
      where: {
        // Adjust this query based on your role system
        // Option 1: If you have a specific manager role
        role: "MANAGER",

        // Option 2: If any user can be a manager
        // id: { not: session.user.id } // Exclude current user if needed
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc", // Sort alphabetically
      },
    });

    return NextResponse.json(managers);
  } catch (error) {
    console.error("Failed to fetch managers:", error);
    return NextResponse.json(
      { error: "Failed to fetch managers" },
      { status: 500 }
    );
  }
}
