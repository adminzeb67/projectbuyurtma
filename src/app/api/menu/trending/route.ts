import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Returns top menu items by order count (most ordered)
export async function GET() {
  try {
    // Get items with their order count
    const topItems = await prisma.orderItem.groupBy({
      by: ["menuItemId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 8,
    });

    if (topItems.length === 0) {
      // Fallback: just return any available items
      const items = await prisma.menuItem.findMany({
        where: { isAvailable: { not: false } },
        include: { category: true },
        take: 8,
        orderBy: { name: "asc" },
      });
      return NextResponse.json(
        items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          emoji: item.image || "🍽️",
          category: item.category.name,
          orderCount: 0,
        }))
      );
    }

    // Fetch full menu item details for the top items
    const ids = topItems.map(t => t.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: ids }, isAvailable: { not: false } },
      include: { category: true },
    });

    // Merge and sort by order count
    const result = ids
      .map(id => {
        const item = menuItems.find(m => m.id === id);
        const stat = topItems.find(t => t.menuItemId === id);
        if (!item) return null;
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          emoji: item.image || "🍽️",
          category: item.category.name,
          orderCount: stat?._sum?.quantity ?? 0,
        };
      })
      .filter(Boolean);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
