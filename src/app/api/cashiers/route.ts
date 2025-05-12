import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const cashiers = await db.cashier.findMany({
      include: {
        shop: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cashiers);
  } catch (error) {
    console.error("Error fetching cashiers:", error);
    return NextResponse.json(
      { error: "Failed to fetch cashiers" },
      { status: 500 }
    );
  }
}
