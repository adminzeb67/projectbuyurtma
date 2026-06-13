const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const items = await prisma.menuItem.findMany();
  console.log('Items in DB:', items.length);
}

check().then(() => prisma.$disconnect());
