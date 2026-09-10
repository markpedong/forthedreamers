export type ProductPageVariant = {
  id: string;
  name: string;
  stock: number;
  price: number;
  discountedPrice: number | null;
  coupon: string | null;
  image: string | null;
  attributes: Record<string, string>;
};

export type ProductPurchaseData = {
  id: string;
  name: string;
  brand: string | null;
  basePrice: number | null;
  categoryName: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  images: string[];
  variants: ProductPageVariant[];
};

export type ProductReview = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
  variant: {
    name: string | null;
  } | null;
};

export type ReviewSummary = {
  average: number;
  count: number;
  distribution: Record<number, number>;
};
