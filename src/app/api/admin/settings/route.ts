import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rest = await prisma.restaurant.findFirst();
    return NextResponse.json({ address: rest?.address || "Manzil kiritilmagan" });
  } catch (error) {
    return NextResponse.json({ address: "Xatolik" });
  }
}

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    const rest = await prisma.restaurant.findFirst();
    if (rest) {
      await prisma.restaurant.update({
        where: { id: rest.id },
        data: { address }
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Xatolik" }, { status: 500 });
  }
}
