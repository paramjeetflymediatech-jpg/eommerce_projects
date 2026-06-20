import { Category, Product, ProductVariant, syncDB } from "../src/lib/models/index";
import slugify from "slugify";

const dummyCategories = [
  {
    name: "Watches",
    slug: "watches",
    description: "Indulge in our collection of ultra-premium timepieces, representing the pinnacle of mechanical precision, luxury design, and craftsmanship.",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Apparel",
    slug: "apparel",
    description: "Curated selection of premium everyday wear, tailoring, and outer layers made of noble fabrics like cashmere, merino wool, and organic cotton.",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Elevate your daily ensembles with hand-finished leather goods, performance eyewear, and elegant details.",
    image: "https://images.unsplash.com/photo-1627124765135-56c33fc36eab?auto=format&fit=crop&q=80&w=800",
  }
];

const dummyProducts = [
  // ── WATCHES ────────────────────────────────────────────────────────────────
  {
    categorySlug: "watches",
    name: "Aion Chrono Classic",
    description: "Engraved bezel, custom hand-finished steel hands, and a sapphire crystal face define the Aion Chrono. Built as a tribute to vintage motorsports, this chronograph is powered by a high-grade mechanical automatic movement, housing a 48-hour power reserve. Water-resistant up to 100 meters, it features a calendar complications dial and solid stainless steel casing for a commanding wrist presence.",
    shortDescription: "Heritage-inspired chronograph watch in polished steel.",
    price: 15900,
    comparePrice: 22000,
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800"
    ],
    tags: ["watch", "chrono", "steel", "luxury"],
    isFeatured: true,
    variants: [
      { size: "40mm", color: "Silver Steel", stock: 15, sku: "WTCH-CHRN-SLV-40" },
      { size: "42mm", color: "Silver Steel", stock: 10, sku: "WTCH-CHRN-SLV-42" }
    ]
  },
  {
    categorySlug: "watches",
    name: "Aion Royale Gold",
    description: "Indulge in pure luxury with the Aion Royale Gold. Electroplated with an ultra-thick 18K yellow gold casing, this masterpiece features a bespoke sunburst dial, Roman numeral hour markers, and hand-stitched premium alligator leather strap. The exhibition caseback reveals the beautifully decorated automatic movement with 25 jewels and 4Hz oscillation. A mark of absolute distinction.",
    shortDescription: "18K Gold plated automatic timepiece with alligator leather strap.",
    price: 45000,
    comparePrice: 60000,
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800"
    ],
    tags: ["watch", "gold", "automatic", "leather"],
    isFeatured: true,
    variants: [
      { size: "38mm", color: "Champagne Gold", stock: 8, sku: "WTCH-ROYG-GLD-38" },
      { size: "41mm", color: "Champagne Gold", stock: 7, sku: "WTCH-ROYG-GLD-41" }
    ]
  },
  {
    categorySlug: "watches",
    name: "Aion Stealth Black",
    description: "Engineered for durability and modern style, the Aion Stealth features a matte black sandblasted carbon-coated case, luminous indices, and a ultra-comfortable vulcanized rubber strap. Ideal for military, diving, and urban exploration, it houses a heavy-duty Japanese automatic movement with shock-resistant mounts.",
    shortDescription: "All-black tactical watch with luminous dial.",
    price: 18500,
    comparePrice: 25000,
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800"
    ],
    tags: ["watch", "tactical", "stealth", "black"],
    isFeatured: false,
    variants: [
      { size: "42mm", color: "Matte Black", stock: 15, sku: "WTCH-STLH-BLK-42" },
      { size: "44mm", color: "Matte Black", stock: 15, sku: "WTCH-STLH-BLK-44" }
    ]
  },

  // ── APPAREL ────────────────────────────────────────────────────────────────
  {
    categorySlug: "apparel",
    name: "Merino Wool Knit Sweater",
    description: "Knitted from 100% fine Italian Merino wool, this crewneck sweater is exceptionally soft, moisture-wicking, and naturally temperature-regulating. It features ribbed cuffs, hem, and neckband, offering a tailored fit that sits comfortably over collared shirts or as a standalone layer.",
    shortDescription: "Ultra-soft Italian Merino wool crewneck sweater.",
    price: 8500,
    comparePrice: 12000,
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1620012253295-c05cb1e7ad77?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800"
    ],
    tags: ["clothing", "sweater", "merino", "winter"],
    isFeatured: true,
    variants: [
      { size: "S", color: "Charcoal Gray", stock: 10, sku: "AP-SWE-GRY-S" },
      { size: "M", color: "Charcoal Gray", stock: 10, sku: "AP-SWE-GRY-M" },
      { size: "L", color: "Charcoal Gray", stock: 10, sku: "AP-SWE-GRY-L" },
      { size: "M", color: "Navy Blue", stock: 5, sku: "AP-SWE-NVY-M" },
      { size: "L", color: "Navy Blue", stock: 5, sku: "AP-SWE-NVY-L" }
    ]
  },
  {
    categorySlug: "apparel",
    name: "Classic Trench Coat",
    description: "Crafted from double-weave cotton gabardine, this weather-resistant double-breasted trench coat represents British tailoring heritage. Features include horn buttons, storm flaps, a structured waist belt, and signature check lining. The silhouette drape is designed to block wind while retaining breathability.",
    shortDescription: "Water-repellent double-breasted cotton trench coat.",
    price: 24000,
    comparePrice: 32000,
    stock: 20,
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800"
    ],
    tags: ["clothing", "jacket", "coat", "trench"],
    isFeatured: true,
    variants: [
      { size: "M", color: "Khaki Beige", stock: 10, sku: "AP-TRN-KHK-M" },
      { size: "L", color: "Khaki Beige", stock: 10, sku: "AP-TRN-KHK-L" }
    ]
  },

  // ── ACCESSORIES ────────────────────────────────────────────────────────────
  {
    categorySlug: "accessories",
    name: "Full-Grain Leather Wallet",
    description: "Handcrafted in Florence from full-grain vegetable-tanned leather, this slim bifold wallet is built to age beautifully, developing a unique patina over time. It features six card slots, a full-length bill compartment, and two receipt pockets, lined with high-strength canvas.",
    shortDescription: "Hand-finished vegetable-tanned leather bifold wallet.",
    price: 4200,
    comparePrice: 6000,
    stock: 50,
    images: [
      "https://images.unsplash.com/photo-1627124765135-56c33fc36eab?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
    ],
    tags: ["leather", "wallet", "accessory"],
    isFeatured: true,
    variants: [
      { size: "Standard", color: "Chestnut Brown", stock: 30, sku: "ACC-WLT-BRN-STD" },
      { size: "Standard", color: "Obsidian Black", stock: 20, sku: "ACC-WLT-BLK-STD" }
    ]
  },
  {
    categorySlug: "accessories",
    name: "Aviator Sunglasses",
    description: "An icon of timeless style, Aion Aviators feature lightweight titanium gold frames, gradient polarized lenses, and soft silicone nose pads. The lenses offer 100% UVA/UVB protection, with scratch-resistant and anti-reflective inner coatings.",
    shortDescription: "Titanium frame polarized classic aviator sunglasses.",
    price: 8900,
    comparePrice: 12000,
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1624222247344-550fb8ecfe08?auto=format&fit=crop&q=80&w=800"
    ],
    tags: ["sunglasses", "aviator", "eyewear", "summer"],
    isFeatured: true,
    variants: [
      { size: "Standard", color: "Gold / Green Lens", stock: 20, sku: "ACC-SUN-GLD-STD" },
      { size: "Standard", color: "Black / Dark Lens", stock: 15, sku: "ACC-SUN-BLK-STD" }
    ]
  }
];

async function seed() {
  console.log("🌱 Starting Database Seeding...");
  try {
    await syncDB();

    console.log("🧹 Clearing existing data (Categories, Products, Variants)...");
    await ProductVariant.destroy({ where: {}, truncate: false, cascade: true });
    await Product.destroy({ where: {}, truncate: false, cascade: true });
    await Category.destroy({ where: {}, truncate: false, cascade: true });

    console.log("📦 Creating Categories...");
    const categoryMap: Record<string, number> = {};
    for (const cat of dummyCategories) {
      const createdCat = await Category.create({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
      });
      categoryMap[cat.slug] = createdCat.id;
      console.log(`   - Category created: ${createdCat.name} (ID: ${createdCat.id})`);
    }

    console.log("🏷️ Creating Products and Variants...");
    for (const prod of dummyProducts) {
      const categoryId = categoryMap[prod.categorySlug];
      if (!categoryId) {
        console.warn(`⚠️ Warning: Category slug '${prod.categorySlug}' not found. Skipping product '${prod.name}'.`);
        continue;
      }

      const createdProduct = await Product.create({
        name: prod.name,
        slug: slugify(prod.name, { lower: true, strict: true }),
        description: prod.description,
        shortDescription: prod.shortDescription,
        price: prod.price,
        comparePrice: prod.comparePrice,
        stock: prod.stock,
        images: prod.images,
        categoryId: categoryId,
        tags: prod.tags,
        rating: 5.0,
        reviewCount: 2,
        isFeatured: prod.isFeatured,
        isActive: true,
      });
      console.log(`   - Product created: ${createdProduct.name} (ID: ${createdProduct.id})`);

      for (const variant of prod.variants) {
        const createdVariant = await ProductVariant.create({
          productId: createdProduct.id,
          size: variant.size,
          color: variant.color,
          stock: variant.stock,
          sku: variant.sku,
          price: createdProduct.price,
          comparePrice: createdProduct.comparePrice,
          images: createdProduct.images,
          description: `Variant: ${variant.color} - Size ${variant.size}`,
        });
        console.log(`     + Variant created: SKU ${createdVariant.sku} (Size: ${createdVariant.size}, Color: ${createdVariant.color})`);
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
