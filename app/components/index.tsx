import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { TProduct } from '@/lib/types';
import ProductCard from './product-card';

export type LandingProduct = Pick<TProduct, 'id' | 'name' | 'images' | 'basePrice' | 'slug'> & {
  variants: { price: number }[];
};

const lifestyle = {
  main: {
    src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop',
    alt: 'Lifestyle Main',
    title: 'Winter Solstice',
  },
  side: [
    {
      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
      alt: 'Lifestyle Detail 1',
    },
    {
      src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop',
      alt: 'Lifestyle Detail 2',
    },
  ],
};

const LifestyleImg: FC<{ src: string; alt: string; title?: string }> = ({ src, alt, title }) => (
  <div className="relative overflow-hidden rounded-sm group h-full">
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 50vw, 100vw"
      className="object-cover transition-transform duration-700 group-hover:scale-105"
    />
    {title && (
      <div className="absolute bottom-0 left-0 p-5 text-white md:p-8">
        <p className="mb-1.5 text-xs uppercase tracking-widest md:mb-2 md:text-sm">Editorial</p>
        <h3 className="text-2xl font-light md:text-3xl">{title}</h3>
      </div>
    )}
  </div>
);

const LandingPage: FC<{ products: LandingProduct[] }> = ({ products = [] }) => (
  <main className="min-h-screen">
    {/* HERO */}
    <section className="relative h-[85vh] flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop"
        alt="Hero"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 space-y-5 px-4 text-center text-white md:space-y-6">
        <Badge className="border-none bg-white/20 px-3 py-1 text-xs tracking-widest text-white backdrop-blur-sm md:px-4">
          New Collection
        </Badge>

        <h1 className="text-3xl font-light tracking-tight md:text-5xl lg:text-7xl">
          Quiet Luxury for <br />
          <span className="font-medium">The Modern Soul</span>
        </h1>

        <p className="mx-auto max-w-lg text-sm font-light text-white/90 md:text-lg lg:text-xl">
          Curated essentials designed for comfort, style, and the moments in between.
        </p>

        <Button asChild size="lg" className="rounded-full bg-white px-6 text-black hover:bg-neutral-200 md:px-8">
          <Link href="/products">Explore Collection</Link>
        </Button>
      </div>
    </section>

    {/* PRODUCTS */}
    <section className="mx-auto max-w-7xl px-4 py-14 md:py-24">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-light tracking-tight md:text-3xl">Curated Essentials</h2>
          <p className="text-sm text-neutral-500 md:text-base">Timeless pieces for your everyday wardrobe.</p>
        </div>

        <Button variant="link" className="group h-auto p-0 text-neutral-500">
          View All Products
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-8 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={i} {...p} />
        ))}
      </div>
    </section>

    {/* LIFESTYLE GRID */}
    <section className="bg-neutral-50 py-14 md:py-24">
      <div className="mx-auto grid h-auto grid-cols-1 gap-4 px-4 md:h-[600px] md:grid-cols-12 md:gap-8 md:px-8 lg:px-4 max-w-7xl">
        <div className="h-[280px] md:col-span-8 md:h-full">
          <LifestyleImg {...lifestyle.main} />
        </div>

        <div className="md:col-span-4 flex flex-col gap-4">
          {lifestyle.side.map((img, i) => (
            <LifestyleImg key={i} {...img} />
          ))}
        </div>
      </div>
    </section>

    {/* NEWSLETTER */}
    <section className="mx-auto max-w-7xl px-4 py-16 text-center md:py-32">
      <div className="mx-auto max-w-md space-y-5 md:space-y-6">
        <h2 className="text-2xl font-light tracking-tight md:text-3xl">Join the Community</h2>
        <p className="text-sm text-neutral-500 md:text-base">
          Sign up for early access to new drops and exclusive editorial content.
        </p>

        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            className="rounded-full border-neutral-200 bg-neutral-50 focus-visible:ring-neutral-400"
          />
          <Button className="rounded-full px-5 md:px-6">Subscribe</Button>
        </div>
      </div>
    </section>
  </main>
);

export default LandingPage;
