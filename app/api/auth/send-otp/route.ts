import { NextResponse } from "next/server";
import { saveOtp } from "@/lib/otp-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { target, channel, fullName } = body;

    if (!target || typeof target !== "string") {
      return NextResponse.json(
        { success: false, message: "Tujuan pengiriman (nomor WA / email) wajib diisi." },
        { status: 400 }
      );
    }

    // Generate 6-digit random OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    saveOtp(target, otpCode, fullName);

    // 1. Channel WhatsApp
    if (channel === "wa") {
      // Normalisasi format nomor telepon Indonesia (e.g. 082244109503 -> 6282244109503)
      let phoneClean = target.replace(/[^0-9]/g, "");
      if (phoneClean.startsWith("0")) {
        phoneClean = "62" + phoneClean.slice(1);
      } else if (!phoneClean.startsWith("62")) {
        phoneClean = "62" + phoneClean;
      }

      const fonnteToken = process.env.FONNTE_TOKEN;
      const wablasToken = process.env.WABLAS_TOKEN;

      // Jika user sudah menyetel FONNTE_TOKEN di environment
      if (fonnteToken) {
        try {
          const res = await fetch("https://api.fonnte.com/send", {
            method: "POST",
            headers: {
              Authorization: fonnteToken,
            },
            body: new URLSearchParams({
              target: phoneClean,
              message: `*CV. ASIA PLASTIK - SISTEM KEAMANAN*\n\nHalo *${fullName || "Staf"}*,\nKode OTP verifikasi Anda untuk registrasi Portal Asia Plastik adalah:\n\n*${otpCode}*\n\nKode ini berlaku selama 5 menit. Jangan berikan kode ini kepada siapa pun demi keamanan akun internal Anda.`,
              countryCode: "62",
            }),
          });

          const data = await res.json();
          if (data.status) {
            return NextResponse.json({
              success: true,
              simulated: false,
              channel: "wa",
              message: `Kode OTP berhasil dikirimkan ke WhatsApp ${target}`,
            });
          } else {
            console.warn("Fonnte error response:", data);
          }
        } catch (err) {
          console.error("Gagal mengirim WhatsApp via Fonnte:", err);
        }
      }

      // Jika user menyetel WABLAS_TOKEN
      if (wablasToken && process.env.WABLAS_DOMAIN) {
        try {
          await fetch(`${process.env.WABLAS_DOMAIN}/api/send-message`, {
            method: "POST",
            headers: {
              Authorization: wablasToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: phoneClean,
              message: `*CV. ASIA PLASTIK*\nKode OTP Anda: *${otpCode}*`,
            }),
          });
          return NextResponse.json({
            success: true,
            simulated: false,
            channel: "wa",
            message: `Kode OTP berhasil dikirimkan ke WhatsApp ${target}`,
          });
        } catch (err) {
          console.error("Gagal mengirim WhatsApp via Wablas:", err);
        }
      }

      // Fallback bila belum ada Gateway Token yang dipasang
      return NextResponse.json({
        success: true,
        simulated: true,
        channel: "wa",
        otp: otpCode,
        targetPhone: phoneClean,
        message:
          "WhatsApp Gateway belum terhubung ke API Token. Masukkan kode simulasi berikut untuk melanjutkan verifikasi.",
      });
    }

    // 2. Channel Email
    if (channel === "email") {
      const resendApiKey = process.env.RESEND_API_KEY;

      if (resendApiKey) {
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Portal Asia Plastik <onboarding@resend.dev>",
              to: target,
              subject: `Kode Verifikasi OTP: ${otpCode} - Portal Asia Plastik`,
              html: `
                <div style="font-family: sans-serif; max-width: 520px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
                  <h2 style="color: #0284c7; margin-bottom: 8px;">CV. ASIA PLASTIK</h2>
                  <p style="color: #475569; font-size: 14px;">Halo <strong>${fullName || "Staf"}</strong>,</p>
                  <p style="color: #475569; font-size: 14px;">Berikut adalah 6-digit kode verifikasi dua langkah (2FA) Anda untuk registrasi akun Portal Asia Plastik:</p>
                  <div style="text-align: center; margin: 24px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0f172a; background: #f0f9ff; padding: 12px 24px; border-radius: 12px; border: 1px solid #bae6fd; font-family: monospace;">${otpCode}</span>
                  </div>
                  <p style="color: #64748b; font-size: 12px;">Kode ini hanya berlaku selama 5 menit. Jangan pernah membagikan kode OTP ini kepada siapa pun termasuk staf manajemen.</p>
                </div>
              `,
            }),
          });

          if (res.ok) {
            return NextResponse.json({
              success: true,
              simulated: false,
              channel: "email",
              message: `Kode OTP berhasil dikirimkan ke Email ${target}`,
            });
          }
        } catch (err) {
          console.error("Gagal mengirim Email via Resend:", err);
        }
      }

      return NextResponse.json({
        success: true,
        simulated: true,
        channel: "email",
        otp: otpCode,
        message:
          "Layanan Email belum terhubung ke API Key. Masukkan kode simulasi berikut untuk melanjutkan verifikasi.",
      });
    }

    return NextResponse.json(
      { success: false, message: "Metode saluran (wa/email) tidak valid." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error pada /api/auth/send-otp:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
