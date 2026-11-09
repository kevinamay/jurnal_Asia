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

export function saveOtp(target: string, code: string, name?: string) {
  const cleanTarget = target.trim().toLowerCase().replace(/[^a-z0-9@.]/g, "");
  otpStore.set(cleanTarget, {
    code,
    name,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 menit
    attempts: 0,
  });
}

export function verifyOtp(
  target: string,
  code: string
): { valid: boolean; reason?: string } {
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
      reason: "Kode OTP telah kadaluarsa (lebih dari 5 menit). Silakan kirim ulang kode baru.",
    };
  }

  if (record.code !== code.trim()) {
    record.attempts += 1;
    if (record.attempts >= 5) {
      otpStore.delete(cleanTarget);
      return {
        valid: false,
        reason: "Terlalu banyak percobaan kode yang salah. Silakan minta kode OTP baru.",
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
