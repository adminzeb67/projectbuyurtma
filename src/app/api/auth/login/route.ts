import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();

    if (!login || !password) {
      return NextResponse.json({ error: "Login va parolni kiriting" }, { status: 400 });
    }

    const adminUser = process.env.ADMIN_USER || "ibragimov";
    const adminPass = process.env.ADMIN_PASS || "xx63blk";

    if (login.toLowerCase() === adminUser.toLowerCase() && password === adminPass) {
      const sessionData = {
        userId: "admin-id",
        username: "ibragimov",
        role: "ADMIN",
      };

      const sessionToken = await encrypt(sessionData);
      const cookieStore = await cookies();
      cookieStore.set("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return NextResponse.json({ success: true, user: sessionData, redirect: "/admin" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: login }, { phone: login }],
      },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Foydalanuvchi topilmadi yoki parol noto'g'ri" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: "Foydalanuvchi topilmadi yoki parol noto'g'ri" }, { status: 401 });
    }

    const sessionData = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const sessionToken = await encrypt(sessionData);
    
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true, user: sessionData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
