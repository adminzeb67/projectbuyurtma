const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          phone: '+998000000000',
          name: 'Administrator',
          username: 'ibragimov',
          role: 'ADMIN',
        }
      });
      console.log('Admin created.');
    } else {
      console.log('Admin already exists.');
    }

    let restaurant = await prisma.restaurant.findFirst();
    if (!restaurant) {
      await prisma.restaurant.create({
        data: {
          name: 'OshFast',
          address: 'Nukus shahri',
          latitude: 0,
          longitude: 0,
          userId: admin.id
        }
      });
      console.log('Restaurant created.');
    } else {
      console.log('Restaurant already exists.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
