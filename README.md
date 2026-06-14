# F.Lavash — Food Delivery PWA

**Stack:** Next.js 16 · Prisma · PostgreSQL (Supabase) · Tailwind CSS · Framer Motion  
**Deploy:** Railway (auto-deploy GitHub `main` branch)

---

## ✅ Bajarilgan ishlar (Oxirgi sessiya)

| # | Bo'lim | Tavsif |
|---|--------|--------|
| 1 | **Asosiy sahifa (UI)** | Kategoriyalar grid (3 ustun), keng trending kartochkalar, "Nega aynan biz?" bo'limi yangilandi |
| 2 | **Sozlamalar sahifasi** | Tab → Accordion dizayni: har bo'lim ochiladi/yopiladi, animatsiya bilan |
| 3 | **Navigatsiya** | "Profilim" → "Sozlamalar" (⚙️ icon), Sidebar va BottomNav yangilandi |
| 4 | **Profil maydonlari** | "Ism" + "Login" → bitta "Ism yoki login" maydoniga birlashtirildi |
| 5 | **Ro'yxatdan o'tish** | Faqat: Ism yoki login · Telefon · Parol · Parolni tasdiqlash |
| 6 | **Admin cheklovi** | Admin hisobi `ibragimov` bazada emas, shuning uchun tahrirlab bo'lmaydi (to'g'ri xabar chiqadi) |
| 7 | **Trend taomlar** | Bazadan dinamik yuklanadi (`/api/menu/trending`) |
| 8 | **Buyurtma tarixi statusi** | Yetkazildi/Kutilmoqda/Tayyorlanmoqda/Bekor — ranglar bilan |

---

## 🔧 Ishlash kerak bo'lgan narsalar (To-Do)

### 🔴 Yuqori ustuvorlik (Critical)
- [ ] **Admin paroli o'zgartirish** — Hozir `.env` da qattiq yozilgan (`ADMIN_USER`, `ADMIN_PASS`). Admin o'z parolini o'zgartira olmaydi. Yechim: Admin uchun alohida profil sahifasi yoki `.env` ni yangilash imkoniyati.
- [ ] **Mijoz profili saqlanmayapti** — `ibragimov` hisobi ADMIN bo'lgani uchun, bu hisob bilan kirganingizda profil tahrir bloklanadi. Oddiy mijoz hisobida tekshirib ko'ring.
- [ ] **Rasm yuklash (Menu Items)** — Menyu taomlarida emoji o'rniga haqiqiy rasm yuklash imkoniyati yo'q hozircha.

### 🟡 O'rta ustuvorlik
- [ ] **To'lov integratsiyasi** — Click yoki Payme orqali haqiqiy to'lov. Hozir faqat UI bor, backend yo'q.
- [ ] **Push Notifications** — Buyurtma holati o'zgarganda mijozga bildirishnoma (Service Worker tayyor, OneSignal/Web Push kerak).
- [ ] **Admin panel — Mijozlar bo'limi xatolari** — Ba'zi holatda mijozlar ro'yxati yuklanmasligi mumkin (Prisma cache bug).
- [ ] **Kategoriyalar** — Hozir 3 ta statik (Ovqatlar, Ichimliklar, Fastfud). Admin paneldan dinamik qo'shish imkoniyati yo'q.

### 🟢 Kichik yaxshilanishlar
- [ ] **Animatsiya — Mahsulot qo'shish** — Menyu sahifasida mahsulot savatga qo'shilganda animatsiya zaif. Kuchaytirish kerak.
- [ ] **Qidiruv** — Asosiy sahifadagi qidiruv hozir Menyu sahifasiga yo'naltiradi. Haqiqiy qidiruv logikasi kerak.
- [ ] **Buyurtma holati Uz tilida** — `DELIVERED`, `PENDING` → "Yetkazildi", "Kutilmoqda" — Sozlamalar sahifasida to'g'rilandi, lekin Orders sahifasida hali ham inglizcha.
- [ ] **SEO / Meta tags** — Har sahifada `<title>` va `<meta description>` to'liq emas.

---

## 🗄️ Ma'lumotlar bazasi

```
DATABASE_URL  — Supabase Connection Pooler URL (Transaction mode)
DIRECT_URL    — Supabase Direct URL (Migration uchun)
ADMIN_USER    — ibragimov (yoki .env da o'zgartirilgan)
ADMIN_PASS    — .env da saqlangan
JWT_SECRET    — Session uchun maxfiy kalit
```

> ⚠️ **Muhim:** `prisma db push` bajargandan keyin Railway'da qayta deploy qiling.  
> `npx prisma db push` → GitHub push → Railway auto-deploy

---

## 🚀 Local ishga tushirish

```bash
npm install
npx prisma generate
npm run dev
```

**URL:** http://localhost:3000  
**Railway:** https://projectbuyurtma-buyurtma.up.railway.app

---

*Oxirgi yangilanish: 2026-06-15*
