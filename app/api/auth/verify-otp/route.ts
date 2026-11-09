import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-store";
import { saveUserRegistration } from "@/lib/user-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { target, otp, verificationToken, userProfile } = body;

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

    // Simpan data pendaftar (nama, email, no hp) ke Firebase Firestore
    let saveResult = null;
    if (userProfile && userProfile.fullName) {
      saveResult = await saveUserRegistration({
        fullName: userProfile.fullName,
        email: userProfile.email || (target.includes("@") ? target : ""),
        phone: userProfile.phone || (!target.includes("@") ? target : ""),
        channel: userProfile.channel || (target.includes("@") ? "email" : "wa"),
        role: "Staf Keuangan",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Verifikasi 2FA berhasil! Akun staf telah berhasil diaktifkan dan disimpan di Firebase Database.",
      savedToFirebase: Boolean(saveResult?.success),
      storageSource: saveResult?.source,
    });
  } catch (error) {
    console.error("Error pada /api/auth/verify-otp:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal saat memverifikasi OTP." },
      { status: 500 }
    );
  }
}
