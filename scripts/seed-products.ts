import prisma from "@/lib/prisma";

async function main() {
  console.log("Starting seed...");

  // Step 1: Create categories
  const categories = await prisma.category.createMany({
    data: [
      { name: "Electronics" },
      { name: "Clothing" },
      { name: "Home & Kitchen" },
      { name: "Sports & Outdoors" },
      { name: "Books" },
      { name: "Toys & Games" },
      { name: "Beauty & Personal Care" },
      { name: "Automotive" },
    ],
    skipDuplicates: true,
  });
  console.log(`Created ${categories.count} categories`);

  // Get category IDs
  const categoryMap = await prisma.category.findMany({
    select: { id: true, name: true },
  });
  const categoryById = new Map(categoryMap.map(c => [c.name, c.id]));

  // Step 2: Create a test seller
  const testUser = await prisma.user.create({
    data: {
      id: "test-seller-001",
      name: "Dreamer Store",
      email: "seller@dreamers.com",
      emailVerified: true,
      role: "SELLER",
    },
  });

  const seller = await prisma.seller.create({
    data: {
      id: "test-seller-001",
      userId: testUser.id,
      storeName: "Dreamer's Shop",
      contact: "+1-555-0123",
      rating: 4.5,
      reviewCount: 128,
      totalSales: 1542.5,
      description: "Premium quality products for dreamers and creators.",
      address: "123 Dream Street, Creative City",
      logo: "https://placehold.co/200x200/4F46E5/FFFFFF?text=DS",
      banner: "https://placehold.co/1200x400/7C3AED/FFFFFF?text=Dreamer%27s+Shop",
    },
  });
  console.log(`Created seller: ${seller.storeName}`);

  // Step 3: Create 10 test products
  const products = [
    {
      name: "Wireless Bluetooth Headphones",
      brand: "SoundWave",
      description: "Premium noise-cancelling wireless headphones with 40-hour battery life and Hi-Res Audio support.",
      images: [
        "https://placehold.co/600x600/1E293B/FFFFFF?text=Headphones+Front",
        "https://placehold.co/600x600/334155/FFFFFF?text=Headphones+Side",
        "https://placehold.co/600x600/475569/FFFFFF?text=Headphones+Case",
      ],
      tags: ["wireless", "bluetooth", "noise-cancelling", "audio"],
      categoryId: categoryById.get("Electronics")!,
      specs: [
        { label: "Battery Life", value: "40 hours" },
        { label: "Connectivity", value: "Bluetooth 5.3" },
        { label: "Driver Size", value: "40mm" },
        { label: "Weight", value: "250g" },
      ],
      variants: [
        {
          name: "Black",
          price: 299.99,
          discountedPrice: 249.99,
          coupon: "SAVE50",
          stock: 150,
          image: "https://placehold.co/600x600/1E293B/FFFFFF?text=Black",
          attributes: { color: "black", size: "standard" },
        },
        {
          name: "White",
          price: 299.99,
          discountedPrice: null,
          coupon: null,
          stock: 75,
          image: "https://placehold.co/600x600/F8FAFC/1E293B?text=White",
          attributes: { color: "white", size: "standard" },
        },
      ],
    },
    {
      name: "Organic Cotton T-Shirt",
      brand: "EcoWear",
      description: "Sustainable organic cotton t-shirt with a relaxed fit. Perfect for everyday wear.",
      images: [
        "https://placehold.co/600x600/065F46/FFFFFF?text=T-Shirt+Front",
        "https://placehold.co/600x600/047857/FFFFFF?text=T-Shirt+Back",
      ],
      tags: ["organic", "cotton", "sustainable", "casual"],
      categoryId: categoryById.get("Clothing")!,
      specs: [
        { label: "Material", value: "100% Organic Cotton" },
        { label: "Fit", value: "Relaxed" },
        { label: "Care", value: "Machine Wash Cold" },
      ],
      variants: [
        {
          name: "Small - Navy",
          price: 49.99,
          discountedPrice: 39.99,
          coupon: "ECOSTYLE",
          stock: 200,
          image: "https://placehold.co/600x600/1E3A5F/FFFFFF?text=S+Navy",
          attributes: { size: "small", color: "navy" },
        },
        {
          name: "Medium - White",
          price: 49.99,
          discountedPrice: null,
          coupon: null,
          stock: 300,
          image: "https://placehold.co/600x600/F8FAFC/1E293B?text=M+White",
          attributes: { size: "medium", color: "white" },
        },
        {
          name: "Large - Black",
          price: 49.99,
          discountedPrice: 44.99,
          coupon: "ECOSTYLE",
          stock: 180,
          image: "https://placehold.co/600x600/1E293B/FFFFFF?text=L+Black",
          attributes: { size: "large", color: "black" },
        },
      ],
    },
    {
      name: "Smart Home Speaker",
      brand: "EchoTech",
      description: "Voice-controlled smart speaker with premium sound and smart home integration.",
      images: [
        "https://placehold.co/600x600/7C2D12/FFFFFF?text=Speaker+Front",
        "https://placehold.co/600x600/9A3412/FFFFFF?text=Speaker+Top",
      ],
      tags: ["smart", "speaker", "voice-control", "iot"],
      categoryId: categoryById.get("Electronics")!,
      specs: [
        { label: "Voice Assistant", value: "Alexa, Google, Siri" },
        { label: "Connectivity", value: "WiFi, Bluetooth" },
        { label: "Power", value: "AC Adapter" },
      ],
      variants: [
        {
          name: "Charcoal",
          price: 129.99,
          discountedPrice: 99.99,
          coupon: "SMARTHOME",
          stock: 500,
          image: "https://placehold.co/600x600/374151/FFFFFF?text=Charcoal",
          attributes: { color: "charcoal" },
        },
        {
          name: "Sandstone",
          price: 129.99,
          discountedPrice: null,
          coupon: null,
          stock: 400,
          image: "https://placehold.co/600x600/F5E6D3/1E293B?text=Sandstone",
          attributes: { color: "sandstone" },
        },
      ],
    },
    {
      name: "Ceramic Pour-Over Coffee Set",
      brand: "BrewCraft",
      description: "Handcrafted ceramic pour-over coffee maker with server. Makes 2-4 cups.",
      images: [
        "https://placehold.co/600x600/78350F/FFFFFF?text=Pour+Over",
        "https://placehold.co/600x600/92400E/FFFFFF?text=Server",
      ],
      tags: ["ceramic", "coffee", "pour-over", "handcrafted"],
      categoryId: categoryById.get("Home & Kitchen")!,
      specs: [
        { label: "Capacity", value: "600ml (2-4 cups)" },
        { label: "Material", value: "Ceramic" },
        { label: "Care", value: "Dishwasher Safe" },
      ],
      variants: [
        {
          name: "Matte Black",
          price: 89.99,
          discountedPrice: 74.99,
          coupon: "BREW10",
          stock: 100,
          image: "https://placehold.co/600x600/1E293B/FFFFFF?text=Black",
          attributes: { color: "matte black" },
        },
        {
          name: "Cream White",
          price: 89.99,
          discountedPrice: null,
          coupon: null,
          stock: 80,
          image: "https://placehold.co/600x600/FEF3C7/1E293B?text=Cream",
          attributes: { color: "cream white" },
        },
      ],
    },
    {
      name: "Yoga Mat Premium",
      brand: "ZenFlex",
      description: "Non-slip premium yoga mat with alignment lines. Eco-friendly TPE material.",
      images: [
        "https://placehold.co/600x600/701A75/FFFFFF?text=Yoga+Mat",
        "https://placehold.co/600x600/86198F/FFFFFF?text=Rolled",
      ],
      tags: ["yoga", "fitness", "non-slip", "eco-friendly"],
      categoryId: categoryById.get("Sports & Outdoors")!,
      specs: [
        { label: "Thickness", value: "6mm" },
        { label: "Material", value: "TPE (Eco-friendly)" },
        { label: "Dimensions", value: "183cm x 61cm" },
        { label: "Weight", value: "900g" },
      ],
      variants: [
        {
          name: "Purple",
          price: 59.99,
          discountedPrice: 49.99,
          coupon: "YOGA20",
          stock: 250,
          image: "https://placehold.co/600x600/701A75/FFFFFF?text=Purple",
          attributes: { color: "purple" },
        },
        {
          name: "Teal",
          price: 59.99,
          discountedPrice: null,
          coupon: null,
          stock: 200,
          image: "https://placehold.co/600x600/0F766E/FFFFFF?text=Teal",
          attributes: { color: "teal" },
        },
      ],
    },
    {
      name: "The Art of Programming",
      brand: "TechBooks Publishing",
      description: "Comprehensive guide to modern software design patterns and clean code practices.",
      images: [
        "https://placehold.co/600x600/1E1B4B/FFFFFF?text=Book+Cover",
        "https://placehold.co/600x600/312E81/FFFFFF?text=Inside",
      ],
      tags: ["programming", "software", "design patterns", "education"],
      categoryId: categoryById.get("Books")!,
      specs: [
        { label: "Pages", value: "456 pages" },
        { label: "Language", value: "English" },
        { label: "Format", value: "Hardcover" },
        { label: "ISBN", value: "978-0-123456-78-9" },
      ],
      variants: [
        {
          name: "Hardcover",
          price: 45.99,
          discountedPrice: 39.99,
          coupon: "BOOKSALE",
          stock: 500,
          image: "https://placehold.co/600x600/1E1B4B/FFFFFF?text=Hardcover",
          attributes: { format: "hardcover" },
        },
        {
          name: "Paperback",
          price: 29.99,
          discountedPrice: 24.99,
          coupon: "BOOKSALE",
          stock: 800,
          image: "https://placehold.co/600x600/FEF3C7/1E293B?text=Paperback",
          attributes: { format: "paperback" },
        },
      ],
    },
    {
      name: "Building Blocks Mega Set",
      brand: "CreativePlay",
      description: "500-piece building blocks set compatible with major brands. Encourages creativity.",
      images: [
        "https://placehold.co/600x600/DC2626/FFFFFF?text=Blocks+Set",
        "https://placehold.co/600x600/EA580C/FFFFFF?text=Examples",
      ],
      tags: ["toys", "building", "creative", "kids"],
      categoryId: categoryById.get("Toys & Games")!,
      specs: [
        { label: "Pieces", value: "500" },
        { label: "Age", value: "6+" },
        { label: "Compatibility", value: "Major brands" },
        { label: "Material", value: "ABS Plastic" },
      ],
      variants: [
        {
          name: "Original Colors",
          price: 39.99,
          discountedPrice: 29.99,
          coupon: "PLAYTIME",
          stock: 350,
          image: "https://placehold.co/600x600/DC2626/FFFFFF?text=Original",
          attributes: { color_scheme: "original" },
        },
        {
          name: "Pastel Collection",
          price: 44.99,
          discountedPrice: null,
          coupon: null,
          stock: 200,
          image: "https://placehold.co/600x600/FCE7F3/1E293B?text=Pastel",
          attributes: { color_scheme: "pastel" },
        },
      ],
    },
    {
      name: "Natural Face Serum",
      brand: "GlowBotanics",
      description: "Vitamin C face serum with hyaluronic acid. Brightens and hydrates skin.",
      images: [
        "https://placehold.co/600x600/4A044E/FFFFFF?text=Serum+Bottle",
        "https://placehold.co/600x600/581C87/FFFFFF?text=Texture",
      ],
      tags: ["skincare", "vitamin+c", "hyaluronic+acid", "natural"],
      categoryId: categoryById.get("Beauty & Personal Care")!,
      specs: [
        { label: "Volume", value: "30ml" },
        { label: "Key Ingredients", value: "Vitamin C, Hyaluronic Acid" },
        { label: "Skin Type", value: "All skin types" },
        { label: "Organic", value: "Yes" },
      ],
      variants: [
        {
          name: "30ml",
          price: 54.99,
          discountedPrice: 44.99,
          coupon: "GLOW15",
          stock: 300,
          image: "https://placehold.co/600x600/581C87/FFFFFF?text=30ml",
          attributes: { size: "30ml" },
        },
        {
          name: "50ml",
          price: 79.99,
          discountedPrice: 64.99,
          coupon: "GLOW20",
          stock: 250,
          image: "https://placehold.co/600x600/7C3AED/FFFFFF?text=50ml",
          attributes: { size: "50ml" },
        },
      ],
    },
    {
      name: "LED Desk Lamp",
      brand: "BrightSpace",
      description: "Adjustable LED desk lamp with USB charging port and 5 brightness levels.",
      images: [
        "https://placehold.co/600x600/1E293B/FFFFFF?text=Lamp+On",
        "https://placehold.co/600x600/334155/FFFFFF?text=Lamp+Off",
      ],
      tags: ["led", "desk+lamp", "usb", "adjustable"],
      categoryId: categoryById.get("Home & Kitchen")!,
      specs: [
        { label: "Brightness Levels", value: "5" },
        { label: "Color Temperature", value: "3000K-6000K" },
        { label: "Power", value: "12W" },
        { label: "Features", value: "USB Charging Port" },
      ],
      variants: [
        {
          name: "Black",
          price: 69.99,
          discountedPrice: 54.99,
          coupon: "BRIGHT10",
          stock: 400,
          image: "https://placehold.co/600x600/1E293B/FFFFFF?text=Black",
          attributes: { color: "black" },
        },
        {
          name: "White",
          price: 69.99,
          discountedPrice: null,
          coupon: null,
          stock: 350,
          image: "https://placehold.co/600x600/F8FAFC/1E293B?text=White",
          attributes: { color: "white" },
        },
      ],
    },
    {
      name: "Carbon Road Bike",
      brand: "VelocityCycles",
      description: "Lightweight carbon fiber road bike with Shimano components. Perfect for racing.",
      images: [
        "https://placehold.co/600x600/0C4A6E/FFFFFF?text=Bike+Side",
        "https://placehold.co/600x600/0369A1/FFFFFF?text=Bike+Front",
      ],
      tags: ["cycling", "carbon+fiber", "road+bike", "shimano"],
      categoryId: categoryById.get("Sports & Outdoors")!,
      specs: [
        { label: "Frame Material", value: "Carbon Fiber" },
        { label: "Weight", value: "8.5kg" },
        { label: "Gears", value: "Shimano 105 (22-speed)" },
        { label: "Wheel Size", value: "700c" },
      ],
      variants: [
        {
          name: "52cm - Blue",
          price: 1899.99,
          discountedPrice: 1599.99,
          coupon: "RACE200",
          stock: 20,
          image: "https://placehold.co/600x600/0C4A6E/FFFFFF?text=52cm+Blue",
          attributes: { size: "52cm", color: "blue" },
        },
        {
          name: "56cm - Red",
          price: 1899.99,
          discountedPrice: 1599.99,
          coupon: "RACE200",
          stock: 15,
          image: "https://placehold.co/600x600/DC2626/FFFFFF?text=56cm+Red",
          attributes: { size: "56cm", color: "red" },
        },
      ],
    },
  ];

  // Create each product with its specs and variants
  for (const productData of products) {
    const slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const product = await prisma.product.create({
      data: {
        id: `test-product-${products.indexOf(productData) + 1}`,
        name: productData.name,
        slug: slug,
        brand: productData.brand,
        basePrice: productData.variants[0].price,
        description: productData.description,
        images: productData.images,
        tags: productData.tags,
        stock: productData.variants.reduce((sum, v) => sum + v.stock, 0),
        status: "ACTIVE",
        categoryId: productData.categoryId,
        sellerId: seller.id,
        specs: {
          create: productData.specs.map((spec) => ({
            label: spec.label,
            value: spec.value,
          })),
        },
        variants: {
          create: productData.variants.map((variant) => ({
            name: variant.name,
            price: variant.price,
            discountedPrice: variant.discountedPrice,
            coupon: variant.coupon,
            stock: variant.stock,
            image: variant.image,
            attributes: variant.attributes,
          })),
        },
      },
      include: {
        specs: true,
        variants: true,
        category: true,
        seller: true,
      },
    });

    console.log(`✓ Created product: ${product.name} (slug: ${product.slug})`);
    console.log(`  - ${product.specs.length} specs, ${product.variants.length} variants`);
  }

  console.log("\nSeed completed successfully!");
  console.log(`Total: ${categories.count} categories, 1 seller, ${products.length} products`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
