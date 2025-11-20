import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Instagram, Twitter, Facebook } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-200">
      {/* Navigation / Header (Minimal) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter uppercase">
            ForTheDreamers
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-neutral-600">
            <Link href="#" className="hover:text-black transition-colors">
              Shop
            </Link>
            <Link href="#" className="hover:text-black transition-colors">
              Collections
            </Link>
            <Link href="#" className="hover:text-black transition-colors">
              About
            </Link>
            <Link href="#" className="hover:text-black transition-colors">
              Journal
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              Search
            </Button>
            <Button variant="outline" size="sm">
              Cart (0)
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop"
            alt="Editorial Hero"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 text-center text-white space-y-6 max-w-2xl px-4">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-none px-4 py-1 text-xs tracking-widest uppercase"
            >
              New Collection
            </Badge>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight">
              Quiet Luxury for <br />
              <span className="font-medium">The Modern Soul</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-lg mx-auto font-light">
              Curated essentials designed for comfort, style, and the moments in
              between.
            </p>
            <div className="pt-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-neutral-200 rounded-full px-8 text-md"
              >
                Explore Collection
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Collection */}
        <section className="py-24 px-4 container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-light tracking-tight mb-2">
                Curated Essentials
              </h2>
              <p className="text-neutral-500">
                Timeless pieces for your everyday wardrobe.
              </p>
            </div>
            <Button variant="link" className="text-neutral-900 p-0 h-auto group">
              View All Products{" "}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "The Classic Tee",
                price: "$45.00",
                image:
                  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop",
              },
              {
                title: "Linen Trousers",
                price: "$120.00",
                image:
                  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1600&auto=format&fit=crop",
              },
              {
                title: "Oversized Knit",
                price: "$180.00",
                image:
                  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1600&auto=format&fit=crop",
              },
              {
                title: "Everyday Tote",
                price: "$85.00",
                image:
                  "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600&auto=format&fit=crop",
              },
            ].map((product, i) => (
              <div key={i} className="group cursor-pointer space-y-3">
                <div className="overflow-hidden rounded-sm bg-neutral-100">
                  <AspectRatio ratio={3 / 4}>
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </AspectRatio>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      {product.title}
                    </h3>
                    <p className="text-sm text-neutral-500">{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lifestyle / Editorial Grid */}
        <section className="py-24 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 h-auto md:h-[600px]">
              {/* Large Featured Image */}
              <div className="md:col-span-8 h-[400px] md:h-full relative overflow-hidden rounded-sm group">
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop"
                  alt="Lifestyle Main"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <p className="text-sm uppercase tracking-widest mb-2">
                    Editorial
                  </p>
                  <h3 className="text-3xl font-light">Winter Solstice</h3>
                </div>
              </div>

              {/* Side Grid */}
              <div className="md:col-span-4 flex flex-col gap-4 md:gap-8 h-full">
                <div className="flex-1 relative overflow-hidden rounded-sm group min-h-[200px]">
                  <Image
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop"
                    alt="Lifestyle Detail 1"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 relative overflow-hidden rounded-sm group min-h-[200px]">
                  <Image
                    src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop"
                    alt="Lifestyle Detail 2"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-32 px-4 container mx-auto text-center">
          <div className="max-w-md mx-auto space-y-6">
            <h2 className="text-3xl font-light tracking-tight">
              Join the Community
            </h2>
            <p className="text-neutral-500">
              Sign up for early access to new drops and exclusive editorial
              content.
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-full bg-neutral-50 border-neutral-200 focus-visible:ring-neutral-400"
              />
              <Button className="rounded-full px-6">Subscribe</Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <h4 className="text-lg font-bold uppercase tracking-tighter">
                ForTheDreamers
              </h4>
              <p className="text-sm text-neutral-500 leading-relaxed">
                A digital space for the modern minimalist. Curated with care,
                designed for life.
              </p>
            </div>
            <div>
              <h5 className="font-medium mb-4">Shop</h5>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li>
                  <Link href="#" className="hover:text-black">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black">
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black">
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black">
                    Sale
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li>
                  <Link href="#" className="hover:text-black">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-4">Connect</h5>
              <div className="flex gap-4 text-neutral-500">
                <Link href="#" className="hover:text-black">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="hover:text-black">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="hover:text-black">
                  <Facebook className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
            <p>© 2024 ForTheDreamers. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-black">
                Terms
              </Link>
              <Link href="#" className="hover:text-black">
                Privacy
              </Link>
              <Link href="#" className="hover:text-black">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
