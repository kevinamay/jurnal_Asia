import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { target, otp, verificationToken } = body;

    if (!target || !otp) {
      return NextResponse.json(
        { success: false, message: "Target dan kode OTP wajib disertakan." },
        { status: 400 }
      );
    }

    const result = verifyOtp(target, otp, verificationToken);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, message: result.reason || "Kode OTP tidak valid." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verifikasi 2FA berhasil! Akun staf telah berhasil diaktifkan.",
    });
  } catch (error) {
    console.error("Error pada /api/auth/verify-otp:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal saat memverifikasi OTP." },
      { status: 500 }
    );
  }
}
