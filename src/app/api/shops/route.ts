import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ShopFormSchema } from "@/lib/validations/shopSchema";

/** Route to FETCH shops */
export async function GET() {
  try {
    const shops = await db.shop.findMany({
      include: {
        cashiers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform data to include cashier count
    const shopsWithCashiers = shops.map((shop) => ({
      ...shop,
      cashierCount: shop.cashiers.length,
    }));

    return NextResponse.json(shopsWithCashiers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch shops" },
      { status: 500 }
    );
  }
}

/** Route to CREATE a shop */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const data = ShopFormSchema.parse(json);

    // Add validation
    if (!data.name || !data.location) {
      return NextResponse.json(
        { error: "Name and location are required" },
        { status: 400 }
      );
    }

    const shop = await db.shop.create({
      data: {
        // ...data,
        name: data.name.trim(),
        location: data.location.trim(),
        shopCommission: Number(data.shopCommission) || 0,
        systemCommission: Number(data.systemCommission) || 0,
        walletBalance: Number(data.walletBalance) || 0,
        managerId: session.user.id,
      },
      include: {
        manager: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(shop);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create shop", details: error },
      { status: 500 }
    );
  }
}
