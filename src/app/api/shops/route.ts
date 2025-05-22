import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ShopFormSchema } from "@/lib/validations/shopSchema";
import { z } from "zod";

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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch shops" },
      { status: 500 }
    );
  }
}

/** Route to CREATE a shop */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // 1. Enhanced authorization check
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Check if user has permission to create shops
  // You might want to add role-based access control
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const json = await req.json();
    const data = ShopFormSchema.parse(json);

    // 3. Additional validation - check if manager exists
    const manager = await db.user.findUnique({
      where: { id: data.managerId },
    });

    if (!manager) {
      return NextResponse.json(
        { error: "Specified manager not found" },
        { status: 400 }
      );
    }

    // 4. Check for duplicate shop names
    const existingShop = await db.shop.findFirst({
      where: {
        name: { equals: data.name.trim(), mode: "insensitive" },
      },
    });

    if (existingShop) {
      return NextResponse.json(
        { error: "Shop with this name already exists" },
        { status: 409 }
      );
    }

    // 5. Create shop with all required fields
    const shop = await db.shop.create({
      data: {
        name: data.name.trim(),
        location: data.location.trim(),
        shopCommission: Number(data.shopCommission) || 0,
        systemCommission: Number(data.systemCommission) || 0,
        walletBalance: Number(data.walletBalance) || 0,
        manager: {
          connect: { id: data.managerId },
        },
      },
      include: {
        manager: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // 6. Return success response
    return NextResponse.json(shop, { status: 201 });
  } catch (error) {
    console.error("Shop creation error:", error);

    // 7. Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
