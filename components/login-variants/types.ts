export interface LoginVariantMeta {
  id: string;
  number: number;
  name: string;
  tag: string;
  description: string;
}

export const LOGIN_VARIANTS_META: LoginVariantMeta[] = [
  {
    id: "1",
    number: 1,
    name: "Desain 1: Modern Split Screen ERP",
    tag: "Split Hero",
    description: "Panel kiri branding korporat biru muda & form login putih elegan di kanan",
  },
  {
    id: "2",
    number: 2,
    name: "Desain 2: Frosted Glassmorphism Card",
    tag: "Glassmorphism",
    description: "Kartu melayang dengan efek kaca frosted mewah & ambient radial mesh biru muda",
  },
  {
    id: "3",
    number: 3,
    name: "Desain 3: Clean Minimalist Studio",
    tag: "Clean Minimal",
    description: "Desain terfokus tanpa distraksi, spasi lega, kartu putih tenang & modern",
  },
  {
    id: "4",
    number: 4,
    name: "Desain 4: Role-Based Tabbed Portal",
    tag: "Role Tabs",
    description: "Tab pemilih divisi (Keuangan, Logistik, Manajemen) dengan badge otoritas",
  },
  {
    id: "5",
    number: 5,
    name: "Desain 5: Dual Auth (Password & WhatsApp OTP)",
    tag: "Dual Auth",
    description: "Opsi toggle fleksibel: kata sandi konvensional atau login instan OTP WhatsApp",
  },
  {
    id: "6",
    number: 6,
    name: "Desain 6: Bento Grid Enterprise Hub",
    tag: "Bento Grid",
    description: "Tata letak modular bento dengan widget status server pabrik & kontak IT",
  },
  {
    id: "7",
    number: 7,
    name: "Desain 7: Executive Slide-Over Drawer",
    tag: "Slide-Over",
    description: "Panel login samping modern dengan latar belakang pratinjau dashboard akuntansi",
  },
  {
    id: "8",
    number: 8,
    name: "Desain 8: Quick PIN & NIK Terminal",
    tag: "PIN / NIK",
    description: "Input cepat NIK staf dan keypad numerik taktil untuk operasional pabrik",
  },
];
