import { productSupplemental } from '@/lib/services/catalog';
import ProductReviews from './product-reviews';
import RelatedProducts from './related-products';
import ReviewForm from './review-form';

type ProductSupplementalProps = {
  productId: string;
  categoryId: string;
  categoryName: string;
  sellerId: string;
  sellerName: string;
  slug: string;
  rating: number;
  reviewCount: number;
};

const ProductSupplemental = async ({
  productId,
  categoryId,
  categoryName,
  sellerId,
  sellerName,
  slug,
  rating,
  reviewCount,
}: ProductSupplementalProps) => {
  const supplemental = await productSupplemental(productId, categoryId, sellerId);
  const summary = {
    average: rating,
    count: reviewCount,
    distribution: supplemental.distribution,
  };

  return (
    <>
      <ProductReviews
        key={JSON.stringify(summary)}
        slug={slug}
        initialReviews={supplemental.reviews}
        summary={summary}
      />
      <ReviewForm slug={slug} />

      <RelatedProducts
        title="More from this seller"
        description={`Explore more products from ${sellerName}.`}
        products={supplemental.sellerProducts}
      />

      <RelatedProducts
        title="You may also like"
        description={`More products from ${categoryName}.`}
        products={supplemental.relatedProducts}
      />
    </>
  );
};

export default ProductSupplemental;
