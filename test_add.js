const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    let restaurant = await prisma.restaurant.findFirst();
    if (!restaurant) throw new Error("No restaurant!");
    
    let category = await prisma.menuCategory.findFirst({
      where: { name: 'Fast Food', restaurantId: restaurant.id }
    });

    if (!category) {
      category = await prisma.menuCategory.create({
        data: { name: 'Fast Food', restaurantId: restaurant.id }
      });
    }

    const newItem = await prisma.menuItem.create({
      data: {
        name: 'Lavash',
        price: 30000,
        description: 'Sirli lavash',
        image: '🌯',
        categoryId: category.id,
        restaurantId: restaurant.id
      }
    });
    console.log('Added:', newItem);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
