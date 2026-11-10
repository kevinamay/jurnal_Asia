import crypto from "crypto";

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  name?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, OtpRecord> | undefined;
}

const otpStore = global.__otpStore || new Map<string, OtpRecord>();
if (process.env.NODE_ENV !== "production") {
  global.__otpStore = otpStore;
}

const OTP_SECRET = process.env.OTP_SECRET || "asia-plastik-production-2fa-token-secret-2026";

/**
 * Buat signed token stateless untuk verifikasi di serverless (Vercel)
 */
export function createSignedOtpToken(target: string, code: string, expiresAt: number) {
  const cleanTarget = target.trim().toLowerCase().replace(/[^a-z0-9@.]/g, "");
  const payload = `${cleanTarget}:${code}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", OTP_SECRET).update(payload).digest("hex");
  return Buffer.from(
    JSON.stringify({ target: cleanTarget, code, expiresAt, signature })
  ).toString("base64");
}

/**
 * Verifikasi signed token stateless (tahan restart/multi-container di Vercel)
 */
export function verifySignedOtpToken(
  token: string,
  target: string,
  code: string
): { valid: boolean; reason?: string } {
  try {
    const raw = Buffer.from(token, "base64").toString("utf-8");
    const parsed = JSON.parse(raw);
    const cleanTarget = target.trim().toLowerCase().replace(/[^a-z0-9@.]/g, "");

    if (parsed.target !== cleanTarget) {
      return { valid: false, reason: "Nomor tujuan atau email tidak sesuai." };
    }

    if (Date.now() > parsed.expiresAt) {
      return { valid: false, reason: "Kode OTP telah kadaluarsa (lebih dari 5 menit). Silakan minta kode baru." };
    }

    const expectedSig = crypto
      .createHmac("sha256", OTP_SECRET)
      .update(`${cleanTarget}:${parsed.code}:${parsed.expiresAt}`)
      .digest("hex");

    if (expectedSig !== parsed.signature) {
      return { valid: false, reason: "Token verifikasi tidak valid." };
    }

    if (parsed.code === code.trim()) {
      return { valid: true };
    }

    return { valid: false, reason: "Kode OTP salah. Harap periksa kembali 6 angka yang dimasukkan." };
  } catch {
    return { valid: false, reason: "Sesi verifikasi tidak valid." };
  }
}

export function saveOtp(target: string, code: string, name?: string): { expiresAt: number; token: string } {
  const cleanTarget = target.trim().toLowerCase().replace(/[^a-z0-9@.]/g, "");
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 menit
  
  otpStore.set(cleanTarget, {
    code,
    name,
    expiresAt,
    attempts: 0,
  });

  const token = createSignedOtpToken(cleanTarget, code, expiresAt);
  return { expiresAt, token };
}

export function verifyOtp(
  target: string,
  code: string,
  token?: string
): { valid: boolean; reason?: string } {
  // Jika ada signed token dari request, prioritaskan (serverless-proof di Vercel)
  if (token) {
    const signedCheck = verifySignedOtpToken(token, target, code);
    if (signedCheck.valid) {
      return { valid: true };
    }
    if (signedCheck.reason && !signedCheck.reason.includes("tidak valid")) {
      return signedCheck;
    }
  }

  const cleanTarget = target.trim().toLowerCase().replace(/[^a-z0-9@.]/g, "");
  const record = otpStore.get(cleanTarget);

  if (!record) {
    return {
      valid: false,
      reason: "Kode OTP belum pernah dikirimkan atau sudah kadaluarsa. Silakan klik 'Kirim Ulang'.",
    };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanTarget);
    return {
      valid: false,
      reason: "Kode OTP telah kadaluarsa. Silakan kirim ulang kode baru.",
    };
  }

  if (record.code !== code.trim()) {
    record.attempts += 1;
    if (record.attempts >= 5) {
      otpStore.delete(cleanTarget);
      return {
        valid: false,
        reason: "Terlalu banyak percobaan salah. Silakan minta kode OTP baru.",
      };
    }
    return {
      valid: false,
      reason: `Kode OTP tidak sesuai. Sisa kesempatan: ${5 - record.attempts} kali.`,
    };
  }

  // Berhasil
  otpStore.delete(cleanTarget);
  return { valid: true };
}
