import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Autentifikatsiya talab qilinadi" }, { status: 401 });
    }

    const session = await decrypt(token);

    // Admin user — DB da yo'q
    if (session.role === "ADMIN") {
      return NextResponse.json({
        id: "admin-id",
        name: "Admin",
        username: session.username,
        phone: "",
        role: "ADMIN",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, username: true, phone: true, role: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
