import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      include: { category: true },
      orderBy: { name: 'asc' }
    });
    
    const formatted = items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category.name,
      desc: item.description || "",
      emoji: item.image || "🍽️",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
