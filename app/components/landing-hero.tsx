'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingHeroProps {
  onSearch?: (query: string) => void;
}

export function LandingHero({ onSearch }: LandingHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-background border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-14 md:py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-16">
          {/* Left: Text & CTA */}
          <div className="flex flex-col gap-4 max-w-2xl animate-fadeInUp">
            <div className="flex flex-col gap-3 md:gap-4">
              <h1 className="text-3xl font-light text-balance leading-tight text-foreground md:text-5xl lg:text-6xl">
                Curated Collections
              </h1>
              <p className="max-w-lg text-sm font-light leading-relaxed text-muted-foreground md:text-base">
                Discover premium products from independent sellers. Shop handpicked items from artisans and creators
                worldwide.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4 sm:pt-4">
              <Button
                size="lg"
                className="rounded-lg bg-foreground px-6 text-background transition-all duration-200 hover:bg-foreground/90 hover:shadow-lg"
              >
                Browse
              </Button>
              <button className="text-foreground hover:text-primary transition-colors font-light underline underline-offset-4">
                Become a Seller
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-2xl animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="relative w-full">
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground md:left-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  onChange={e => onSearch?.(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground/30 focus:outline-none md:py-3 md:pl-12 md:text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
