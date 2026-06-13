// Prisma 7 uchun adapter talab qiladi.
// Bu oddiy SQL query orqali admin yaratadi.
const { Client } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  const hashedPassword = await bcrypt.hash("xx63blk", 10);

  // Check if admin already exists
  const check = await client.query(
    `SELECT id FROM "User" WHERE username = $1 LIMIT 1`,
    ["ibragimov"]
  );

  if (check.rows.length > 0) {
    console.log("✅ Admin allaqachon mavjud: ibragimov");
  } else {
    const id = `admin_${Date.now()}`;
    await client.query(
      `INSERT INTO "User" (id, phone, name, username, password, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [id, "+998900000001", "Ibragimov Admin", "ibragimov", hashedPassword, "ADMIN"]
    );
    console.log("✅ Admin yaratildi: ibragimov / xx63blk");
  }

  await client.end();
}

main().catch((e) => {
  console.error("❌ Xato:", e.message);
  process.exit(1);
});
