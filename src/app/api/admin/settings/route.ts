import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rest = await prisma.restaurant.findFirst();
    const settings = await prisma.systemSetting.findMany();
    const blacklist = await prisma.blacklist.findMany();
    
    return NextResponse.json({ 
      address: rest?.address || "Manzil kiritilmagan",
      settings, 
      blacklist 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.address) {
      const rest = await prisma.restaurant.findFirst();
      if (rest) {
        await prisma.restaurant.update({
          where: { id: rest.id },
          data: { address: body.address }
        });
      }
    }

    if (body.settings) {
      for (const [key, value] of Object.entries(body.settings)) {
        await prisma.systemSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        });
      }
    }

    if (body.blacklistPhone) {
      await prisma.blacklist.create({
        data: {
          phone: body.blacklistPhone,
          reason: body.blacklistReason || "Kiritilmagan",
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("blacklistId");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    await prisma.blacklist.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
