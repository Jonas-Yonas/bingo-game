import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { shopId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, method, reference } = await request.json();

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be positive" },
        { status: 400 }
      );
    }

    const shopId = params.shopId;

    // Verify shop exists
    const shopExists = await db.shop.findUnique({
      where: { id: shopId },
    });

    if (!shopExists) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Start transaction
    const result = await db.$transaction([
      db.shop.update({
        where: { id: shopId },
        data: {
          walletBalance: {
            increment: amount,
          },
        },
      }),
      db.walletTransaction.create({
        data: {
          amount,
          type: "CREDIT",
          method,
          reference,
          shopId,
          processedById: session?.user.id,
        },
      }),
    ]);

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("[SHOP_TOP_UP]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
