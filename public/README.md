# Folder Asset Publik (Next.js)

Folder ini digunakan untuk menyimpan seluruh asset statis seperti gambar, logo perusahaan, foto avatar, icon, dan dokumen pendukung proyek **KledoFlow Accounting**.

## 📁 Struktur Folder
- `public/images/` : Foto, banner, ilustrasi grafis, atau screenshot.
- `public/logos/` : Logo perusahaan, logo bank mitra (BCA, Mandiri, BRI, dll), atau ikon merek.
- `public/avatars/` : Foto profil pengguna (user avatar/staff finance).
- `public/icons/` : Ikon kustom (.svg, .png, .ico).

---

## 💡 Cara Penggunaan di Komponen Next.js

Semua file yang diletakkan di dalam folder `public/` dapat langsung diakses dari URL root `/`.

### Contoh 1: Menggunakan `next/image` (Disarankan)
```tsx
import Image from "next/image";

export function CompanyLogo() {
  return (
    <Image
      src="/logos/company-logo.svg"
      alt="Logo Perusahaan"
      width={160}
      height={40}
      priority
    />
  );
}
```

### Contoh 2: Menggunakan tag `<img>` standar
```tsx
<img src="/avatars/user-profile.jpg" alt="Foto Profil" className="w-10 h-10 rounded-full" />
```

