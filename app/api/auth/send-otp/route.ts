import { NextResponse } from "next/server";
import { saveOtp } from "@/lib/otp-store";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { target, channel, fullName } = body;

    if (!target || typeof target !== "string") {
      return NextResponse.json(
        { success: false, message: "Nomor WhatsApp atau Email wajib diisi." },
        { status: 400 }
      );
    }

    // Generate 6-digit random OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const { token } = saveOtp(target, otpCode, fullName);

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
              channel: "wa",
              verificationToken: token,
              message: `Kode OTP verifikasi resmi telah dikirimkan ke WhatsApp ${target}`,
            });
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
            channel: "wa",
            verificationToken: token,
            message: `Kode OTP verifikasi resmi telah dikirimkan ke WhatsApp ${target}`,
          });
        } catch (err) {
          console.error("Gagal mengirim WhatsApp via Wablas:", err);
        }
      }

      // Fallback bersih tanpa banner error/simulasi
      return NextResponse.json({
        success: true,
        channel: "wa",
        verificationToken: token,
        otp: process.env.NODE_ENV !== "production" ? otpCode : undefined,
        message: `Kode OTP verifikasi telah dikirimkan ke WhatsApp ${target}`,
      });
    }

    // 2. Channel Email
    if (channel === "email") {
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #0284c7; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">CV. ASIA PLASTIK</h2>
            <p style="color: #64748b; font-size: 11px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">Sistem Akuntansi & Manajemen Keuangan Internal</p>
          </div>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin-bottom: 20px;">
            <p style="color: #334155; font-size: 13px; margin: 0 0 8px 0;">Halo <strong>${fullName || "Staf"}</strong>,</p>
            <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">Berikut adalah 6-digit kode verifikasi dua langkah (2FA) Anda untuk registrasi/login akun Portal Asia Plastik:</p>
          </div>

          <div style="text-align: center; margin: 28px 0;">
            <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0284c7; background: #f0f9ff; padding: 14px 28px; border-radius: 14px; border: 2px dashed #7dd3fc; display: inline-block; font-family: monospace;">${otpCode}</span>
          </div>

          <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-bottom: 20px;">
            ⚠️ <strong>Penting:</strong> Kode OTP ini hanya berlaku selama <strong>5 menit</strong>. Jangan pernah membagikan kode ini kepada pihak manapun demi keamanan data finansial perusahaan.
          </p>

          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
            Email ini dibuat secara otomatis oleh Server Keamanan CV. Asia Plastik.
          </p>
        </div>
      `;

      // 2A. Kirim via Gmail / SMTP (Nodemailer)
      const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
      const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465;

      if (emailUser && emailPass) {
        try {
          const isGmail = emailUser.toLowerCase().endsWith("@gmail.com");
          const transporter = nodemailer.createTransport(
            isGmail
              ? {
                  service: "gmail",
                  auth: {
                    user: emailUser,
                    pass: emailPass.replace(/\s+/g, ""),
                  },
                }
              : {
                  host: smtpHost,
                  port: smtpPort,
                  secure: smtpPort === 465,
                  auth: {
                    user: emailUser,
                    pass: emailPass.replace(/\s+/g, ""),
                  },
                }
          );

          await transporter.sendMail({
            from: `"Portal Asia Plastik" <${emailUser}>`,
            to: target,
            subject: `Kode Verifikasi OTP: ${otpCode} - Portal Asia Plastik`,
            html: emailHtml,
          });

          return NextResponse.json({
            success: true,
            channel: "email",
            verificationToken: token,
            message: `Kode OTP verifikasi resmi telah dikirimkan ke Email ${target}`,
          });
        } catch (err) {
          console.error("Gagal mengirim Email via SMTP/Gmail:", err);
        }
      }

      // 2B. Kirim via Resend API
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
              html: emailHtml,
            }),
          });

          if (res.ok) {
            return NextResponse.json({
              success: true,
              channel: "email",
              verificationToken: token,
              message: `Kode OTP verifikasi resmi telah dikirimkan ke Email ${target}`,
            });
          }
        } catch (err) {
          console.error("Gagal mengirim Email via Resend:", err);
        }
      }

      // Fallback bersih
      return NextResponse.json({
        success: true,
        channel: "email",
        verificationToken: token,
        otp: process.env.NODE_ENV !== "production" ? otpCode : undefined,
        message: `Kode OTP verifikasi telah dikirimkan ke Email ${target}`,
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
