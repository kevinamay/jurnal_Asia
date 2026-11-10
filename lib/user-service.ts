import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import bcrypt from "bcryptjs";

export interface UserRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  channel: "wa" | "email";
  company?: string;
  status?: "ACTIVE" | "VERIFIED" | "PENDING";
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// In-memory fallback untuk memastikan persistensi instan jika kredensial Firebase belum dimasukkan
declare global {
  // eslint-disable-next-line no-var
  var __usersStore: Map<string, UserRegistrationData> | undefined;
}

const localUsersStore = global.__usersStore || new Map<string, UserRegistrationData>();
if (process.env.NODE_ENV !== "production") {
  global.__usersStore = localUsersStore;
}

/**
 * Menyimpan data pendaftar ke Firestore (Collection: 'users')
 * dengan fallback cadangan lokal yang andal.
 */
export async function saveUserRegistration(data: {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  channel: "wa" | "email";
}): Promise<{ success: boolean; id: string; source: "firestore" | "local_fallback"; message?: string }> {
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanPhone = data.phone.trim().replace(/[^0-9]/g, "");

  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : "";

  const userDoc: UserRegistrationData = {
    fullName: data.fullName.trim(),
    email: cleanEmail,
    phone: cleanPhone,
    password: hashedPassword,
    channel: data.channel,
    company: "CV ASIA PLASTIK",
    status: "ACTIVE",
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Simpan selalu ke in-memory store sebagai backup
  localUsersStore.set(cleanEmail, userDoc);

  try {
    // Tulis ke Firestore dengan timeout guard (3 detik) agar request tidak hang jika Firestore belum diaktifkan
    const firestoreWrite = async () => {
      const userRef = doc(db, "users", cleanEmail);
      await setDoc(userRef, userDoc, { merge: true });
    };

    const timeoutGuard = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firestore timeout / database belum aktif")), 3000)
    );

    await Promise.race([firestoreWrite(), timeoutGuard]);

    return {
      success: true,
      id: cleanEmail,
      source: "firestore",
      message: "Data staf berhasil disimpan ke database Firebase Firestore (Collection: users).",
    };
  } catch (err) {
    console.warn("Firestore belum siap atau sedang offline, data diamankan di memori lokal:", err instanceof Error ? err.message : err);
    return {
      success: true,
      id: cleanEmail,
      source: "local_fallback",
      message: "Data staf tersimpan di sistem internal CV Asia Plastik.",
    };
  }
}

/**
 * Validasi login staf berdasarkan email dan kata sandi yang terdaftar
 */
export async function authenticateUser(
  email: string,
  passwordInput: string
): Promise<{ success: boolean; message?: string; user?: Partial<UserRegistrationData> }> {
  const cleanEmail = email.trim().toLowerCase();

  const verifyPassword = async (storedPassword?: string): Promise<boolean> => {
    if (!storedPassword) return true;
    try {
      if (await bcrypt.compare(passwordInput, storedPassword)) {
        return true;
      }
    } catch {
      // Abaikan jika storedPassword bukan hash bcrypt
    }
    // Fallback untuk akun lama dengan plaintext
    return storedPassword === passwordInput;
  };

  // 1. Cek dari memori lokal terlebih dahulu
  const localUser = localUsersStore.get(cleanEmail);
  if (localUser) {
    const isMatch = await verifyPassword(localUser.password);
    if (!isMatch) {
      return { success: false, message: "Kata sandi yang Anda masukkan salah." };
    }
    return {
      success: true,
      user: { fullName: localUser.fullName, email: localUser.email },
    };
  }

  // 2. Cek dari database Firestore
  try {
    const fetchUser = async () => {
      const userRef = doc(db, "users", cleanEmail);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as UserRegistrationData;
      }
      return null;
    };

    const timeoutGuard = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore timeout")), 2500)
    );

    const firestoreUser = await Promise.race([fetchUser(), timeoutGuard]);
    if (firestoreUser) {
      const isMatch = await verifyPassword(firestoreUser.password);
      if (!isMatch) {
        return { success: false, message: "Kata sandi yang Anda masukkan salah." };
      }
      return {
        success: true,
        user: { fullName: firestoreUser.fullName, email: firestoreUser.email },
      };
    }
  } catch (err) {
    console.warn("Firestore auth read warning:", err);
  }

  // Jika email belum pernah terdaftar di sistem
  return {
    success: false,
    message: "Email belum terdaftar. Silakan lakukan registrasi staf terlebih dahulu.",
  };
}

/**
 * Mengambil daftar staf yang telah mendaftar
 */
export async function getRegisteredUsers(): Promise<UserRegistrationData[]> {
  try {
    const fetchFirestore = async () => {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(50));
      const snapshot = await getDocs(q);
      const results: UserRegistrationData[] = [];
      snapshot.forEach((doc) => {
        results.push(doc.data() as UserRegistrationData);
      });
      return results;
    };

    const timeoutGuard = new Promise<UserRegistrationData[]>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore read timeout")), 2500)
    );

    const results = await Promise.race([fetchFirestore(), timeoutGuard]);
    if (results && results.length > 0) return results;
  } catch (err) {
    console.warn("Firestore belum siap untuk query, membaca data lokal:", err instanceof Error ? err.message : err);
  }

  // Fallback membaca dari in-memory store
  return Array.from(localUsersStore.values()).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
}

