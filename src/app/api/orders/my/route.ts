import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret");
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json(orders);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
