import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Return all orders for Excel Export
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        courier: true,
      },
      orderBy: { createdAt: "desc" }
    });

    // Return PromoCodes
    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ orders, promoCodes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { code, discount, type } = await request.json();
    
    const promo = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discount: Number(discount),
        type: type || "PERCENT"
      }
    });

    return NextResponse.json({ success: true, promo });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
