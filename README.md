# OshFast / TaomYet — Ovqat Yetkazib Berish Platformasi (PWA)

O'zbekiston bo'ylab ovqat buyurtma qilish va yetkazib berish xizmati.  
Progressive Web App (PWA) — brauzer orqali ochiladi va ilova kabi o'rnatiladi.

## 🚀 Loyiha haqida

OshFast — zamonaviy ovqat yetkazib berish platformasi. Real-time kuzatuv, hudud tanlash (Qoraqalpog'iston Xo'jayli tumani va boshqa hududlar), to'liq admin boshqaruvi va qulay mijoz interfeysi mavjud.

## 🛠 Texnologiya Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT (jose), bcryptjs
- **Styling:** TailwindCSS v4
- **UI Icons:** Lucide React
- **PWA:** @ducanh2912/next-pwa

## 📁 Loyiha tuzilmasi

```
src/
  app/
    page.tsx              — Profil sahifasi (Mening profilim)
    menu/page.tsx         — Menyu va buyurtma wizard
    orders/page.tsx       — Buyurtmalar tarixi
    admin/                — Admin panel
    api/
      auth/
        login/            — Kirish
        register/         — Ro'yxatdan o'tish
        logout/           — Chiqish
        me/               — Joriy foydalanuvchi ma'lumotlari (GET)
        profile/          — Profilni yangilash (PUT)
      menu/               — Menyu API
      orders/             — Buyurtmalar API
  components/
    AuthView.tsx          — Kirish/Ro'yxatdan o'tish sahifasi
    BottomNav.tsx         — Mobil pastki navigatsiya
    LayoutWrapper.tsx     — Layout (Sidebar + BottomNav)
    SuccessAnimation.tsx  — Animatsion muvaffaqiyat modali
    SplashScreen.tsx      — Boshlang'ich yuklanish ekrani
```

## ✨ Amalga oshirilgan funksiyalar

### Mijoz tarafi

#### Profil sahifasi (`/`)
- Foydalanuvchi avatar (ismi boshiga ko'ra, masalan "SA" — Sanjar uchun)
- OshFast logotipi badge sifatida
- **Mening profilim** bo'limi:
  - Ism (tahrirlash mumkin)
  - Login / username (tahrirlash mumkin)
  - Telefon raqam (tahrirlash mumkin)
  - Yangi parol (ixtiyoriy, tahrirlash rejimida)
  - Parolni tasdiqlash
- Tahrirlash rejimi — "Tahrirlash" tugmasi bilan ochiladi
- Saqlashda muvaffaqiyat toast xabari
- Tezkor "Buyurtmalarim" havolasi

#### Menyu sahifasi (`/menu`)
- Taomlar grid ko'rinishida
- Kategorialar bo'yicha filtrlash
- Qidiruv
- Buyurtma wizard (5 qadam):
  1. Taom tafsilotlari
  2. Ichimlik qo'shish taklifi
  3. Ichimlik tanlash
  4. To'lov turi
  5. Telefon + Lokatsiya
- **Animatsion muvaffaqiyat modali** (konfetti + puls effekti)

#### Buyurtmalar tarixi (`/orders`)
- Barcha buyurtmalar ro'yxati

#### Pastki navigatsiya (mobil)
- Asosiy (profil), Menyu, Buyurtmalar
- `z-index: 100` — hech narsa ustiga chiqmasligi uchun
- iPhone safe-area qo'llab-quvvatlashi (`env(safe-area-inset-bottom)`)

### Ro'yxatdan o'tish / Kirish
- **Animatsion muvaffaqiyat modali** ro'yxatdan o'tgandan keyin
- Konfetti + "Tabriklaymiz!" xabari

### Admin Panel (`/admin`)
- Dashboard, buyurtmalar, menyu boshqaruvi
- Alohida layout (BottomNav va Sidebar ko'rsatilmaydi)

## 🔐 Auth tizimi

- JWT token — `session` cookie da saqlanadi (httpOnly, 7 kun)
- Admin: `.env` da `ADMIN_USER` va `ADMIN_PASS`
- Oddiy foydalanuvchilar: Prisma `User` modelida

## 📱 O'rnatish (PWA)

1. Chrome (Android) yoki Safari (iOS) orqali saytga kiring
2. "Add to Home Screen" / "Install App" tugmasini tanlang
3. OshFast ilova sifatida telefoningizda ishlaydi

## 🏃 Ishga tushirish

```bash
npm install
npm run dev
```

Brauzerda: [http://localhost:3000](http://localhost:3000)

## O'zgarishlar tarixi

| Sana | O'zgarish |
|------|-----------|
| 2026-06-14 | Profil sahifasi: "Mening profilim" bo'limi qo'shildi (ism, login, telefon, parol) |
| 2026-06-14 | `/api/auth/me` — joriy foydalanuvchi ma'lumotlari API |
| 2026-06-14 | `/api/auth/profile` — profil yangilash API (PUT) |
| 2026-06-14 | SuccessAnimation komponenti: buyurtma va ro'yxatdan o'tish animatsiyalari |
| 2026-06-14 | BottomNav tuzatildi: `z-[100]`, safe-area, ustiga chiqmaslik |
| 2026-06-14 | Bosh sahifadan keraksiz bo'limlar (Manzil, Onlayn to'lov, Biz haqimizda) olib tashlandi |
