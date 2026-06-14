import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const couriers = await prisma.user.findMany({
      where: { role: "COURIER" },
      include: {
        courierOrders: {
          where: { status: "DELIVERED" },
          select: { id: true, totalAmount: true }
        }
      }
    });

    // Kuryerlar balansini hisoblash
    const mappedCouriers = couriers.map(c => {
      const deliveredCount = c.courierOrders.length;
      // Har bir yetkazib berish uchun ma'lum so'm (masalan 15,000 so'm) xizmat haqi
      const balance = deliveredCount * 15000;
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        deliveredCount,
        balance
      };
    });

    return NextResponse.json(mappedCouriers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, phone, password } = await request.json();
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const courier = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        role: "COURIER",
      }
    });
    
    return NextResponse.json(courier);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
