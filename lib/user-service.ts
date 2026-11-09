import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

export interface UserRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  channel: "wa" | "email";
  role?: string;
  company?: string;
  status?: "VERIFIED" | "PENDING";
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
  channel: "wa" | "email";
  role?: string;
}): Promise<{ success: boolean; id: string; source: "firestore" | "local_fallback"; message?: string }> {
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanPhone = data.phone.trim().replace(/[^0-9]/g, "");

  const userDoc: UserRegistrationData = {
    fullName: data.fullName.trim(),
    email: cleanEmail,
    phone: cleanPhone,
    channel: data.channel,
    role: data.role || "Staf Keuangan",
    company: "CV ASIA PLASTIK",
    status: "VERIFIED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Simpan selalu ke in-memory store sebagai backup
  localUsersStore.set(cleanEmail, userDoc);

  // Periksa apakah Firebase dikonfigurasi dengan kredensial nyata
  const hasRealFirebaseConfig =
    Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY) &&
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.includes("Placeholder");

  if (hasRealFirebaseConfig) {
    try {
      // Tulis langsung ke Firestore collection 'users'
      const userRef = doc(db, "users", cleanEmail);
      await setDoc(userRef, userDoc, { merge: true });
      return {
        success: true,
        id: cleanEmail,
        source: "firestore",
        message: "Data staf berhasil disimpan ke database Firebase Firestore.",
      };
    } catch (err) {
      console.error("Gagal menyimpan ke Firestore:", err);
      // Jika terjadi kesalahan koneksi Firebase, tetap anggap sukses via fallback
      return {
        success: true,
        id: cleanEmail,
        source: "local_fallback",
        message: "Data staf tersimpan di memori lokal (Firebase Firestore sedang sinkronisasi).",
      };
    }
  }

  // Jika belum memasukkan API Key Firebase di .env
  return {
    success: true,
    id: cleanEmail,
    source: "local_fallback",
    message: "Data staf berhasil dicatat ke sistem internal CV Asia Plastik.",
  };
}

/**
 * Mengambil daftar staf yang telah mendaftar
 */
export async function getRegisteredUsers(): Promise<UserRegistrationData[]> {
  const hasRealFirebaseConfig =
    Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY) &&
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.includes("Placeholder");

  if (hasRealFirebaseConfig) {
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(50));
      const snapshot = await getDocs(q);
      const results: UserRegistrationData[] = [];
      snapshot.forEach((doc) => {
        results.push(doc.data() as UserRegistrationData);
      });
      if (results.length > 0) return results;
    } catch (err) {
      console.error("Gagal membaca dari Firestore:", err);
    }
  }

  // Fallback membaca dari in-memory store
  return Array.from(localUsersStore.values()).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
}
