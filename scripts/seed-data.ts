import { Product, Category, syncDB } from "../src/lib/models/index";
import slugify from "slugify";

const seedCategories = [
  {
    name: "Living Room",
    slug: "living-room",
    description: "Modern furniture for your living space",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80",
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    description: "Comfortable beds and storage for your bedroom",
    image: "https://images.unsplash.com/photo-1505693314120-0d4438678210?auto=format&fit=crop&q=80",
  },
  {
    name: "Dining",
    slug: "dining",
    description: "Elegant dining sets and lighting",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80",
  },
  {
    name: "Office",
    slug: "office",
    description: "Ergonomic furniture for your workspace",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80",
  },
  {
    name: "Decor",
    slug: "decor",
    description: "Art and accessories to complete your look",
    image: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?auto=format&fit=crop&q=80",
  },
];

const seedProducts = [
  {
    name: "Velvet Emerald Sofa",
    slug: "velvet-emerald-sofa",
    categorySlug: "living-room",
    price: 899.99,
    description: "Luxurious velvet sofa in a deep emerald green, perfect for any modern living room.",
    shortDescription: "Plush velvet 3-seater sofa",
    stock: 12,
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80"],
    isFeatured: true,
  },
  {
    name: "Mid-Century Coffee Table",
    slug: "mid-century-coffee-table",
    categorySlug: "living-room",
    price: 249.00,
    description: "Solid oak coffee table with a mid-century modern aesthetic and tapered legs.",
    shortDescription: "Elegant oak coffee table",
    stock: 25,
    images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80"],
  },
  {
    name: "King Velvet Bed Frame",
    slug: "king-velvet-bed-frame",
    categorySlug: "bedroom",
    price: 1299.50,
    description: "A statement bed frame upholstered in soft charcoal velvet with a tufted headboard.",
    shortDescription: "King size velvet bed with headboard",
    stock: 8,
    images: ["https://images.unsplash.com/photo-1505693314120-0d4438678210?auto=format&fit=crop&q=80"],
    isFeatured: true,
  },
  {
    name: "Oak Dining Table",
    slug: "oak-dining-table",
    categorySlug: "dining",
    price: 650.00,
    description: "Hand-crafted solid oak dining table that seats up to 6 people.",
    shortDescription: "6-seater solid oak table",
    stock: 15,
    images: ["https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80"],
  },
  {
    name: "Ergonomic Desk Chair",
    slug: "ergonomic-desk-chair",
    categorySlug: "office",
    price: 349.99,
    description: "High-performance ergonomic chair with lumbar support and adjustable armrests.",
    shortDescription: "Adjustable office chair with support",
    stock: 40,
    images: ["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80"],
  },
  {
    name: "Modern Floor Lamp",
    slug: "modern-floor-lamp",
    categorySlug: "decor",
    price: 129.00,
    description: "Minimalist brass floor lamp with an adjustable neck for perfect reading light.",
    shortDescription: "Sleek brass floor lamp",
    stock: 20,
    images: ["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80"],
  },
  {
    name: "Abstract Canvas Art",
    slug: "abstract-canvas-art",
    categorySlug: "decor",
    price: 85.00,
    description: "One-of-a-kind abstract painting on large canvas, hand-painted with acrylics.",
    shortDescription: "Colorful abstract wall art",
    stock: 5,
    images: ["https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80"],
  },
];

async function seed() {
  console.log("🚀 Starting database seed...");
  try {
    await syncDB();

    const categoryMap: Record<string, number> = {};

    console.log("📂 Seeding categories...");
    for (const catData of seedCategories) {
      const [category] = await Category.findOrCreate({
        where: { slug: catData.slug },
        defaults: catData,
      });
      categoryMap[catData.slug] = category.id;
      console.log(`✅ Category: ${catData.name}`);
    }

    console.log("🛒 Seeding products...");
    for (const prodData of seedProducts) {
      const categoryId = categoryMap[prodData.categorySlug];
      if (!categoryId) {
        console.warn(`⚠️ Skipping ${prodData.name}: Category ${prodData.categorySlug} not found.`);
        continue;
      }

      const { categorySlug, ...productAttributes } = prodData;
      
      const [product, created] = await Product.findOrCreate({
        where: { slug: prodData.slug },
        defaults: {
          ...productAttributes,
          categoryId,
          rating: 0,
          reviewCount: 0,
          isActive: true,
        } as any,
      });

      if (created) {
        console.log(`✅ Product: ${prodData.name}`);
      } else {
        console.log(`ℹ️ Product already exists: ${prodData.name}`);
      }
    }

    console.log("✨ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
