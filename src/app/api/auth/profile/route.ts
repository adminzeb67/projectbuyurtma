import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt, encrypt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Autentifikatsiya talab qilinadi" }, { status: 401 });
    }

    const session = await decrypt(token);



    const { name, username, phone, password, confirmPassword } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Ism bo'sh bo'lishi mumkin emas" }, { status: 400 });
    }

    // Check if username is taken by another user
    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username, NOT: { id: session.userId } },
      });
      if (existing) {
        return NextResponse.json({ error: "Bu login band, boshqa tanlang" }, { status: 400 });
      }
    }

    // Check phone uniqueness
    if (phone) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone, NOT: { id: session.userId } },
      });
      if (existingPhone) {
        return NextResponse.json({ error: "Bu telefon raqam allaqachon ro'yxatdan o'tgan" }, { status: 400 });
      }
    }

    const updateData: any = {
      name: name.trim(),
      username: username?.trim() || undefined,
      phone: phone?.trim() || undefined,
    };

    if (password) {
      if (password !== confirmPassword) {
        return NextResponse.json({ error: "Parollar mos kelmadi" }, { status: 400 });
      }
      if (password.length < 6) {
        return NextResponse.json({ error: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
      select: { id: true, name: true, username: true, phone: true, role: true },
    });

    // Refresh session with new username
    const newSession = { userId: updated.id, username: updated.username || updated.name, role: updated.role };
    const newToken = await encrypt(newSession);
    cookieStore.set("session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
