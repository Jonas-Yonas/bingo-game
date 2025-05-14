import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { CashierFormSchema } from "@/lib/validations/cashierSchema";
import { authOptions } from "@/lib/authOptions";

/** Route to GET single cashier with details */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cashierId = params.id;

  try {
    const cashier = await db.cashier.findUnique({
      where: { id: cashierId },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });

    if (!cashier) {
      return NextResponse.json({ error: "Cashier not found" }, { status: 404 });
    }

    const transformedCashier = {
      ...cashier,
      avatar: cashier.user?.image || null,
      userId: cashier.user?.id || null,
    };

    return NextResponse.json(transformedCashier);
  } catch (error) {
    console.error("[CASHIER_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/** Route to UPDATE a cashier */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cashierId = params.id;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = CashierFormSchema.parse(body);

    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const updatedCashier = await db.cashier.update({
      where: { id: cashierId },
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim(),
        isActive: data.isActive,
        status: data.status,
        shopId: data.shopId,
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCashier);
  } catch (error) {
    console.error("Error updating cashier:", error);
    return NextResponse.json(
      { error: "Failed to update cashier" },
      { status: 500 }
    );
  }
}

/** Route to DELETE a cashier */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cashierId = params.id;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cashier = await db.cashier.findUnique({
      where: { id: cashierId },
    });

    if (!cashier) {
      return NextResponse.json({ error: "Cashier not found" }, { status: 404 });
    }

    if (cashier.userId) {
      return NextResponse.json(
        {
          error: "Cannot delete cashier",
          message:
            "This cashier is linked to a user account. Unlink the user first.",
        },
        { status: 400 }
      );
    }

    await db.cashier.delete({
      where: { id: cashierId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cashier:", error);
    return NextResponse.json(
      { error: "Failed to delete cashier" },
      { status: 500 }
    );
  }
}
