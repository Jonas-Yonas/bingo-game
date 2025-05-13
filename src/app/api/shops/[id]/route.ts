import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { ShopFormSchema } from "@/lib/validations/shopSchema";
import { authOptions } from "@/lib/authOptions";
import { useParams } from "next/navigation";

/** Route to GET a shop */
export async function GET() {
  const { id: shopId } = useParams() as { id: string };

  try {
    const shop = await db.shop.findUnique({
      where: { id: shopId },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        cashiers: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isActive: true,
            status: true,
            user: {
              select: {
                id: true,
                image: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Transform cashiers data for better UI consumption
    const transformedShop = {
      ...shop,
      cashiers: shop.cashiers.map((cashier) => ({
        ...cashier,
        avatar: cashier.user?.image || null,
        userId: cashier.user?.id || null,
      })),
    };

    return NextResponse.json(transformedShop);
  } catch (error) {
    console.error("[SHOP_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/** Route to EDIT a shop */
export async function PATCH(req: NextRequest) {
  const { id: shopId } = useParams() as { id: string };

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = ShopFormSchema.parse(body);

    const updatedShop = await db.shop.update({
      where: { id: shopId },
      data: {
        name: data.name.trim(),
        location: data.location.trim(),
        shopCommission: Number(data.shopCommission),
        systemCommission: Number(data.systemCommission),
        walletBalance: Number(data.walletBalance),
        // Don't update managerId here to prevent accidental changes
      },
    });

    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error("Error updating shop:", error);
    return NextResponse.json(
      { error: "Failed to update shop" },
      { status: 500 }
    );
  }
}

/** Route to DELETE a shop */
export async function DELETE() {
  const { id: shopId } = useParams() as { id: string };

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if shop exists and has cashiers
    const shop = await db.shop.findUnique({
      where: { id: shopId },
      include: { cashiers: true },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    if (shop.cashiers.length > 0) {
      return NextResponse.json(
        { error: "Shop has active cashiers" },
        { status: 400 }
      );
    }

    await db.shop.delete({
      where: { id: shopId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting shop:", error);
    return NextResponse.json(
      { error: "Failed to delete shop" },
      { status: 500 }
    );
  }
}
