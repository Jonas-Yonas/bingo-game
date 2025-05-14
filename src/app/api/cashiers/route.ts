import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { CashierFormSchema } from "@/lib/validations/cashierSchema";

/** Route to FETCH cashiers */
export async function GET() {
  try {
    const cashiers = await db.cashier.findMany({
      include: {
        shop: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cashiers);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch cashiers" },
      { status: 500 }
    );
  }
}

/** Route to CREATE a cashier */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const data = CashierFormSchema.parse(json);

    // Additional validation
    if (!data.name || !data.email || !data.shopId) {
      return NextResponse.json(
        { error: "Name, email and shop assignment are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingCashier = await db.cashier.findUnique({
      where: { email: data.email },
    });

    if (existingCashier) {
      return NextResponse.json(
        { error: "Cashier with this email already exists" },
        { status: 409 }
      );
    }

    const cashier = await db.cashier.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim(),
        isActive: data.isActive,
        status: data.status,
        shopId: data.shopId,
        userId: session.user.id, // Link to creating user if needed
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

    return NextResponse.json(cashier);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create cashier", details: error },
      { status: 500 }
    );
  }
}
