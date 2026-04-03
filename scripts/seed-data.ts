import { Product, Category, ProductVariant, syncDB } from "../src/lib/models/index";

const seedCategories = [
  {
    name: "Men's Clothing",
    slug: "mens-clothing",
    description: "Premium apparel for men, from casual tees to formal wear.",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80",
  },
  {
    name: "Women's Clothing",
    slug: "womens-clothing",
    description: "Elegant and trendy styles for the modern woman.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80",
  },
  {
    name: "Shoes",
    slug: "shoes",
    description: "High-performance footwear and stylish sneakers.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80",
  },
  {
    name: "Jeans & Denim",
    slug: "jeans",
    description: "Premium denim in every fit and wash.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80",
  },
];

const seedProducts = [
  // MEN'S CLOTHING
  {
    name: "Classic Oxford Shirt",
    slug: "classic-oxford-shirt",
    categorySlug: "mens-clothing",
    price: 45.00,
    description: "A versatile button-down shirt crafted from premium oxford cotton. Features a tailored fit and structured collar.",
    shortDescription: "Timeless cotton Oxford button-down",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80"
    ],
    isFeatured: true,
    variantType: "clothing",
  },
  {
    name: "Standard Fit Crew Tee",
    slug: "standard-crew-tee",
    categorySlug: "mens-clothing",
    price: 25.00,
    description: "The perfect everyday t-shirt. Mid-weight cotton with a refined crew neck and standard fit.",
    shortDescription: "Essential 100% cotton crew neck",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80"
    ],
    isFeatured: false,
    variantType: "clothing",
  },

  // WOMEN'S CLOTHING
  {
    name: "Satin Wrap Dress",
    slug: "satin-wrap-dress",
    categorySlug: "womens-clothing",
    price: 110.00,
    description: "An elegant wrap dress in shimmering satin. Features a flattering silhouette and mid-length hem.",
    shortDescription: "Shimmering satin occasion dress",
    images: [
      "https://images.unsplash.com/photo-1541099649105-039cd7a84393?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80"
    ],
    isFeatured: true,
    variantType: "clothing",
  },
  {
    name: "Cashmere Turtleneck",
    slug: "cashmere-turtleneck",
    categorySlug: "womens-clothing",
    price: 150.00,
    description: "Luxuriously soft cashmere sweater. Designed for ultimate warmth and a sophisticated look.",
    shortDescription: "Ultra-soft premium cashmere",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd30e?auto=format&fit=crop&q=80"
    ],
    isFeatured: true,
    variantType: "clothing",
  },

  // SHOES
  {
    name: "Pro Run Performance",
    slug: "pro-run-sneakers",
    categorySlug: "shoes",
    price: 125.00,
    description: "Engineered for distance. These sneakers feature high-rebound cushioning and a breathable mesh upper.",
    shortDescription: "High-performance running sneakers",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80"
    ],
    isFeatured: true,
    variantType: "shoes",
  },
  {
    name: "Leather Chelsea Boots",
    slug: "leather-chelsea-boots",
    categorySlug: "shoes",
    price: 180.00,
    description: "Premium full-grain leather boots with elastic side panels and a durable rubber sole.",
    shortDescription: "Classic full-grain leather boots",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603487742131-4160ec999331?auto=format&fit=crop&q=80"
    ],
    isFeatured: false,
    variantType: "shoes",
  },

  // JEANS
  {
    name: "Raw Selvedge Denim",
    slug: "raw-selvedge-jeans",
    categorySlug: "jeans",
    price: 145.00,
    description: "Heavyweight indigo denim that will develop a unique patina over time. Tapered fit, classic styling.",
    shortDescription: "Premium unwashed selvedge denim",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80"
    ],
    isFeatured: true,
    variantType: "jeans",
  },
  {
    name: "High Rise Skinny",
    slug: "high-rise-skinny",
    categorySlug: "jeans",
    price: 85.00,
    description: "Perfectly stretchy and incredibly flattering. Designed to hold their shape all day long.",
    shortDescription: "Contouring high-rise skinny jeans",
    images: [
      "https://images.unsplash.com/photo-1541099649105-039cd7a84393?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&q=80"
    ],
    isFeatured: false,
    variantType: "jeans",
  },
];

const variantSizes = {
  clothing: ["S", "M", "L", "XL"],
  shoes: ["8", "9", "10", "11", "12"],
  jeans: ["28", "30", "32", "34", "36"],
};

async function seed() {
  console.log("🚀 Starting database seed...");
  try {
    await syncDB();

    console.log("🧹 Cleaning old data...");
    // Force clear everything to ensure a pure clothing-focused database
    await ProductVariant.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });

    const categoryMap: Record<string, number> = {};

    console.log("📂 Seeding clothing categories...");
    for (const catData of seedCategories) {
      const category = await Category.create(catData);
      categoryMap[catData.slug] = category.id;
      console.log(`✅ Category: ${catData.name}`);
    }

    const variantColors = ["Black", "Navy", "Sand", "Olive"];

    const colorImageSets: Record<string, string[]> = {
      "Black": [
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80"
      ],
      "White": [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618354691438-25bb0ef58b2c?auto=format&fit=crop&q=80"
      ],
      "Navy": [
        "https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80"
      ],
      "Sand": [
        "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1523381235312-d7286a039401?auto=format&fit=crop&q=80"
      ],
      "Dark Indigo": [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80"
      ],
      "Washed Blue": [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80"
      ],
      "Original": [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80"
      ]
    };

    console.log("🛒 Seeding premium apparel and variants...");
    for (const prodData of seedProducts) {
      const categoryId = categoryMap[prodData.categorySlug];
      const { categorySlug, variantType, ...productAttributes } = prodData;

      const product = await Product.create({
        ...productAttributes,
        categoryId,
        stock: 200, // Total aggregate stock
        rating: 4.8,
        reviewCount: Math.floor(Math.random() * 50) + 10,
        isActive: true,
      } as any);

      console.log(`✅ Product: ${product.name}`);

      // Seed variants across sizes and colors
      const sizes = variantSizes[variantType as keyof typeof variantSizes];
      const colors = productAttributes.name.includes("Shirt") || productAttributes.name.includes("Tee") 
        ? variantColors 
        : ["Original", "Washed Blue", "Dark Indigo"];

      for (const color of colors) {
        for (const size of sizes) {
          // Randomize stock and price slightly per variant for realism
          const priceOverride = Math.random() > 0.8 ? product.price + 10 : null;
          // Assign color-specific image set to each variant
          const variantImages = colorImageSets[color] || productAttributes.images;

          await ProductVariant.create({
            productId: product.id,
            size,
            color,
            stock: Math.floor(Math.random() * 15) + 5,
            price: priceOverride,
            sku: `${product.slug}-${color[0]}-${size}`.toUpperCase(),
            images: variantImages
          });
        }
      }
      console.log(`   └─ Seeded ${sizes.length * colors.length} variants across ${colors.length} colors`);
    }

    console.log("✨ Seeding completed successfully! Database is now purely clothing-focused.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
