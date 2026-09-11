// Throwaway: replace placeholder images with real Unsplash photos.
// Unsplash is already in next.config.ts remotePatterns, so next/image works unchanged.
import prisma from '@/lib/prisma';

// Real Unsplash photo IDs, matched loosely to each seeded product.
const IMAGES: Record<string, string[]> = {
  'test-product-1': [
    'photo-1505740420928-5e560c06d30e',
    'photo-1484704849700-f032a568e944',
    'photo-1583394838336-acd977736f90',
  ],
  'test-product-2': [
    'photo-1521572163474-6864f9cf17ab',
    'photo-1503341504253-dff4815485f1',
    'photo-1576566588028-4147f3842f27',
  ],
  'test-product-3': [
    'photo-1589003077984-894e133dabab',
    'photo-1543512214-318c7553f230',
  ],
  'test-product-4': [
    'photo-1495474472287-4d71bcdd2085',
    'photo-1514432324607-a09d9b4aefdd',
  ],
  'test-product-5': [
    'photo-1544367567-0f2fcb009e0b',
    'photo-1592432678016-e910b452f9a2',
  ],
  'test-product-6': [
    'photo-1544716278-ca5e3f4abd8c',
    'photo-1512820790803-83ca734da794',
  ],
  'test-product-7': [
    'photo-1587654780291-39c9404d746b',
    'photo-1594787318286-3d835c1d207f',
  ],
  'test-product-8': [
    'photo-1620916566398-39f1143ab7be',
    'photo-1598440947619-2c35fc9aa908',
  ],
  'test-product-9': [
    'photo-1507473885765-e6ed057f782c',
    'photo-1534073828943-f801091bb18c',
  ],
  'test-product-10': [
    'photo-1485965120184-e220f721d03e',
    'photo-1532298229144-0ec0c57515c7',
  ],
};

const url = (id: string, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// seed-images.ts keys Unsplash photos by the old 'test-product-N' ids; orderBy name matches
// the order seed-products.ts declares them in (indexOf + 1), so map by position.
const IMAGE_LIST = Object.keys(IMAGES)
  .sort((a, b) => Number(a.replace('test-product-', '')) - Number(b.replace('test-product-', '')))
  .map(k => IMAGES[k]);

const main = async () => {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, variants: { select: { id: true } } },
    orderBy: { name: 'asc' },
  });

  let updated = 0;
  for (const [index, product] of products.entries()) {
    const ids = IMAGE_LIST[index];
    if (!ids) {
      console.log(`skip (no mapping): #${index} ${product.name}`);
      continue;
    }

    // Randomize which photos this product gets, so nothing looks uniform.
    const shuffled = [...ids].sort(() => Math.random() - 0.5);
    const gallery = shuffled.map(id => url(id));

    await prisma.product.update({
      where: { id: product.id },
      data: { images: gallery },
    });

    // Give each variant its own randomly picked lead image.
    for (const variant of product.variants) {
      const pick = gallery[Math.floor(Math.random() * gallery.length)];
      await prisma.variant.update({ where: { id: variant.id }, data: { image: pick } });
    }

    updated++;
    console.log(`✓ ${product.name}: ${gallery.length} images, ${product.variants.length} variants`);
  }

  console.log(`\nupdated ${updated}/${products.length} products`);

  // Prove they resolve.
  const sample = await prisma.product.findMany({
    take: 3,
    select: { name: true, images: true },
    orderBy: { id: 'asc' },
  });
  console.log('\nsample:');
  for (const s of sample) console.log(` ${s.name}\n   ${s.images[0]}`);

  await prisma.$disconnect();
};

main().catch(async e => {
  console.error('FAILED:', e?.message?.split('\n').slice(0, 3).join(' | ') ?? e);
  process.exitCode = 1;
  await prisma.$disconnect();
});
