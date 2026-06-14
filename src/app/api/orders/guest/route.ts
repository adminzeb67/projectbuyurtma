import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDistance, estimateTime } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { name, phone, items, totalAmount, paymentMethod, location } = await request.json();

    if (!phone || !items || !items.length) {
      return NextResponse.json({ error: "Ma'lumotlarni to'ldiring" }, { status: 400 });
    }

    let guestUser = await prisma.user.findFirst({
      where: { username: "_guest_orders" },
    });

    if (!guestUser) {
      const bcrypt = require("bcryptjs");
      guestUser = await prisma.user.create({
        data: {
          name: "Mehmon Buyurtmalar",
          username: "_guest_orders",
          phone: "+998000000000",
          password: await bcrypt.hash("guest_no_login", 10),
          role: "CLIENT",
        },
      });
    }

    let restaurant = await prisma.restaurant.findFirst();
    if (!restaurant) {
      restaurant = await prisma.restaurant.create({
        data: {
          name: "OshFast Asosiy",
          address: "Nukus, Qoraqalpog'iston",
          latitude: 42.46,
          longitude: 59.61,
          userId: guestUser.id,
        },
      });
    }

    let category = await prisma.menuCategory.findFirst({
      where: { restaurantId: restaurant.id },
    });
    if (!category) {
      category = await prisma.menuCategory.create({
        data: { name: "Asosiy", restaurantId: restaurant.id },
      });
    }

    const createdItems = [];
    for (const item of items) {
      let menuItem = await prisma.menuItem.findFirst({
        where: { name: item.name, restaurantId: restaurant.id },
      });
      if (!menuItem) {
        menuItem = await prisma.menuItem.create({
          data: {
            name: item.name,
            price: item.price,
            categoryId: category.id,
            restaurantId: restaurant.id,
          },
        });
      }
      createdItems.push({
        menuItemId: menuItem.id,
        quantity: item.quantity || 1,
        price: item.price,
      });
    }

    const locLat = location ? parseFloat(location.split(',')[0]) : 42.46;
    const locLng = location ? parseFloat(location.split(',')[1]) : 59.61;
    
    // Xo'jayli tumani uchun masofa hisoblash (restoran koordinatalari bilan)
    const distanceKm = getDistance(restaurant.latitude, restaurant.longitude, locLat, locLng);
    const estTime = estimateTime(distanceKm);

    const paymentStr = paymentMethod === "CASH" ? "Naqd pul" : "Plastik karta";
    const deliveryAddressStr = `Telefon: ${phone} | Ism: ${name || 'Mijoz'} | Lokatsiya: ${location} | To'lov: ${paymentStr}`;

    const order = await prisma.order.create({
      data: {
        totalAmount: totalAmount,
        deliveryAddress: deliveryAddressStr,
        latitude: locLat,
        longitude: locLng,
        paymentMethod: paymentMethod === "CASH" ? "Naqd" : "Karta",
        estimatedTime: estTime,
        customerId: guestUser.id,
        restaurantId: restaurant.id,
        items: {
          create: createdItems,
        },
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
