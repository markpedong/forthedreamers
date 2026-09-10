import { productBySlug, productSlugs } from '@/lib/services/catalog';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProductInfoTabs from './components/product-info-tabs';
import ProductPageClient from './components/product-page-client';
import ProductSupplemental from './components/product-supplemental';

const ProductPage = async (props: PageProps<'/products/[slug]'>) => {
  const { slug } = await props.params;
  const product = await productBySlug(slug);
  if (!product) notFound();

  const purchaseProduct = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    basePrice: product.basePrice,
    categoryName: product.category.name,
    rating: product.rating,
    reviewCount: product.reviewCount,
    soldCount: product.sold,
    images: product.images,
    variants: product.variants,
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-16 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Home / {product.category.name} / {product.name}
        </div>

        <ProductPageClient product={purchaseProduct} />

        <ProductInfoTabs
          product={{
            brand: product.brand,
            description: product.description,
            tags: product.tags,
            category: product.category,
            specs: product.specs,
            variants: product.variants,
            seller: product.seller,
            sellerProductCount: product.sellerProductCount,
          }}
        />

        <Suspense
          fallback={
            <div className="rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">
              Loading reviews and recommendations…
            </div>
          }
        >
          <ProductSupplemental
            productId={product.id}
            categoryId={product.category.id}
            categoryName={product.category.name}
            sellerId={product.seller.id}
            sellerName={product.seller.storeName}
            slug={slug}
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </Suspense>
      </div>
    </main>
  );
};

export const generateStaticParams = async () => (await productSlugs()).map(({ slug }) => ({ slug }));
export const revalidate = 60;
export default ProductPage;
