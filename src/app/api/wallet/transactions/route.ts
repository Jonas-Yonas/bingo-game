import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch transactions for the current user's shops
    const transactions = await db.walletTransaction.findMany({
      where: {
        processedById: session?.user.id, // Only transactions processed by current user
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        shop: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("[GET_TRANSACTIONS]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
