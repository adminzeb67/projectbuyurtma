import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: { status: "DELIVERED" },
    });

    const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const salesCount = orders.length;

    // Kunlik daromad
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const activeUsers = new Set(orders.map(o => o.customerId)).size;
    const menuCount = await prisma.menuItem.count();

    // Mashhur taomlarni hisoblash
    const allItems = await prisma.orderItem.findMany({
      include: { menuItem: true },
    });
    
    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    allItems.forEach(item => {
      if (!itemCounts[item.menuItemId]) {
        itemCounts[item.menuItemId] = { name: item.menuItem.name, count: 0, revenue: 0 };
      }
      itemCounts[item.menuItemId].count += item.quantity;
      itemCounts[item.menuItemId].revenue += (item.quantity * item.price);
    });

    const popularItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      revenue,
      todayRevenue,
      salesCount,
      activeUsers,
      menuCount,
      popularItems
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
