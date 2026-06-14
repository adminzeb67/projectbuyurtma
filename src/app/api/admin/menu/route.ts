import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      include: { category: true },
      orderBy: { name: 'asc' }
    });
    
    // Format to match the previous hardcoded structure
    const formatted = items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category.name,
      desc: item.description || "",
      emoji: item.image || "🍽️",
      isAvailable: item.isAvailable,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, categoryName, desc, emoji } = await request.json();
    
    let restaurant = await prisma.restaurant.findFirst();
    if (!restaurant) {
      // Create a default restaurant if missing
      const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      if (!admin) throw new Error("No admin user found to assign restaurant.");
      
      restaurant = await prisma.restaurant.create({
        data: {
          name: "OshFast",
          address: "Manzil kiritilmagan",
          latitude: 0,
          longitude: 0,
          userId: admin.id
        }
      });
    }

    // Upsert Category
    let category = await prisma.menuCategory.findFirst({
      where: { name: categoryName, restaurantId: restaurant.id }
    });

    if (!category) {
      category = await prisma.menuCategory.create({
        data: { name: categoryName, restaurantId: restaurant.id }
      });
    }

    // Create item
    const newItem = await prisma.menuItem.create({
      data: {
        name,
        price: Number(price),
        description: desc,
        image: emoji,
        categoryId: category.id,
        restaurantId: restaurant.id
      }
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, isAvailable } = await request.json();
    const updated = await prisma.menuItem.update({
      where: { id },
      data: { isAvailable }
    });
    return NextResponse.json({ success: true, isAvailable: updated.isAvailable });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (id) {
      // Because orderItems might be linked, we can either soft delete or actually delete if cascade is on.
      // We will do soft delete (isAvailable = false) or if orderItems exist, we might get an error.
      // Let's try to delete orderItems first, or just mark isAvailable = false.
      
      const count = await prisma.orderItem.count({ where: { menuItemId: id } });
      if (count > 0) {
        // Soft delete
        await prisma.menuItem.update({
          where: { id },
          data: { isAvailable: false }
        });
      } else {
        await prisma.menuItem.delete({
          where: { id }
        });
      }
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
