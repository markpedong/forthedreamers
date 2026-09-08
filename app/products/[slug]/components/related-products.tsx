import ProductCard from '@/app/components/product-card';

type RelatedProduct = {
  id: string;
  name: string;
  images: string[];
  basePrice: number | null;
  slug: string;
  rating: number;
  reviewCount: number;
  variants: Array<{ price: number }>;
};

type RelatedProductsProps = {
  title: string;
  description: string;
  products: RelatedProduct[];
};

const RelatedProducts = ({ title, description, products }: RelatedProductsProps) => {
  if (!products.length) return null;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
