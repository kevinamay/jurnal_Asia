import { NextResponse } from "next/server";
import { getRegisteredUsers, saveUserRegistration } from "@/lib/user-service";

export async function GET() {
  try {
    const users = await getRegisteredUsers();
    return NextResponse.json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error reading users:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pendaftar dari Firebase." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, channel } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, message: "Nama, email, dan no hp wajib diisi." },
        { status: 400 }
      );
    }

    const result = await saveUserRegistration({
      fullName,
      email,
      phone,
      channel: channel || "wa",
    });

    return NextResponse.json({
      success: true,
      message: "Data pendaftar berhasil disimpan ke database Firebase.",
      result,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal saat menyimpan pendaftar." },
      { status: 500 }
    );
  }
}

