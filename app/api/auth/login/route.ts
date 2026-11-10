import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/user-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const authResult = await authenticateUser(email, password);

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message || "Email atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login berhasil. Selamat datang di Portal Keuangan CV Asia Plastik.",
      user: authResult.user,
    });
  } catch (error) {
    console.error("Error pada /api/auth/login:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server login." },
      { status: 500 }
    );
  }
}

