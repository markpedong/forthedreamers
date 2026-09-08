import prisma from '@/lib/prisma';

async function main() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });
  console.log('CATEGORIES:', JSON.stringify(categories, null, 2));

  const sellers = await prisma.seller.findMany({
    select: { id: true, storeName: true },
  });
  console.log('SELLERS:', JSON.stringify(sellers, null, 2));

  const products = await prisma.product.findMany({
    take: 5,
    select: {
      id: true,
      name: true,
      brand: true,
      basePrice: true,
      status: true,
    },
  });
  console.log('PRODUCTS:', JSON.stringify(products, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
