import prisma from '@/lib/prisma';

async function main() {
  const products = await prisma.product.findMany({
    include: {
      specs: true,
      variants: true,
      category: true,
      seller: true,
    },
    orderBy: { name: 'asc' },
  });

  console.log(`\n=== VERIFIED: ${products.length} Products ===\n`);

  for (const p of products) {
    console.log(`[${p.id}] ${p.name}`);
    console.log(`  Brand: ${p.brand}`);
    console.log(`  Price: $${p.basePrice}`);
    console.log(`  Status: ${p.status}`);
    console.log(`  Category: ${p.category.name}`);
    console.log(`  Seller: ${p.seller.storeName}`);
    console.log(`  Slug: ${p.slug}`);
    console.log(`  Stock: ${p.stock}`);
    console.log(`  Tags: ${p.tags.join(', ')}`);
    console.log(`  Specs: ${p.specs.map(s => s.label + ': ' + s.value).join(' | ')}`);
    console.log(`  Variants (${p.variants.length}):`);
    for (const v of p.variants) {
      console.log(
        `    - ${v.name}: $${v.price}${v.discountedPrice ? ' (was $${v.discountedPrice})' : ''} | Stock: ${v.stock}`
      );
    }
    console.log('');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
