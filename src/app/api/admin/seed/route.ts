import { NextResponse } from "next/server";
import { Category, Product, syncDB } from "@/lib/models";

export async function GET() {
  try {
    // 1. Ensure DB is synced and tables exist
    await syncDB();

    // 2. Clear existing categories and products
    // (Optional: only if you want a fresh start)
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });

    // 3. Create Categories
    const categories = await Category.bulkCreate([
      {
        name: "Electronics",
        slug: "electronics",
        description: "Latest gadgets, high-performance laptops, and premium smartphones.",
        image: "/images/categories/electronics.png",
      },
      {
        name: "Fashion",
        slug: "fashion",
        description: "Discover the latest trends in clothing, watches, and accessories.",
        image: "/images/categories/fashion.png",
      },
      {
        name: "Home & Living",
        slug: "home-living",
        description: "Transform your space with modern furniture and premium home decor.",
        image: "/images/categories/home.png",
      },
      {
        name: "Beauty & Health",
        slug: "beauty-health",
        description: "Luxury skincare, beauty essentials, and wellness products.",
        image: "/images/categories/beauty.png",
      },
    ]);

    const catIds = {
      electronics: categories.find(c => c.slug === "electronics")?.id as number,
      fashion: categories.find(c => c.slug === "fashion")?.id as number,
      home: categories.find(c => c.slug === "home-living")?.id as number,
      beauty: categories.find(c => c.slug === "beauty-health")?.id as number,
    };

    // 4. Create Products
    await Product.bulkCreate([
      // Electronics
      {
        name: "NextGen UltraBook Pro",
        slug: "nextgen-ultrabook-pro",
        description: "The ultimate productivity machine with a 14-inch OLED display, M3 Max equivalent power, and 32GB RAM. Perfect for designers and developers who demand the best performance in a slim form factor.",
        shortDescription: "Powerful 14-inch laptop with OLED display and 32GB RAM.",
        price: 1899.99,
        comparePrice: 2199.99,
        stock: 25,
        categoryId: catIds.electronics,
        images: ["/images/categories/electronics.png"],
        isFeatured: true,
        rating: 4.9,
        reviewCount: 128,
        tags: ["laptop", "pro", "electronics"],
      },
      {
        name: "SoundMaster Wireless Headphones",
        slug: "soundmaster-wireless-headphones",
        description: "Experience studio-quality sound with active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cups. Features spatial audio and multipoint Bluetooth connectivity.",
        shortDescription: "Premium ANC headphones with 40h battery life.",
        price: 299.99,
        comparePrice: 349.99,
        stock: 50,
        categoryId: catIds.electronics,
        images: ["/images/categories/electronics.png"],
        isFeatured: true,
        rating: 4.8,
        reviewCount: 245,
        tags: ["audio", "headphones", "wireless"],
      },
      {
        name: "Titan 5G Smartphone",
        slug: "titan-5g-smartphone",
        description: "Redefining the smartphone experience with a 200MP camera, 120Hz LTPO display, and all-day battery life. The most advanced mobile processor ensures everything runs smooth as silk.",
        shortDescription: "Flagship 5G phone with a revolutionary 200MP camera.",
        price: 999.00,
        stock: 100,
        categoryId: catIds.electronics,
        images: ["/images/categories/electronics.png"],
        rating: 4.7,
        reviewCount: 512,
        tags: ["phone", "5g", "titan"],
      },

      // Fashion
      {
        name: "Classic Leather Chronograph",
        slug: "classic-leather-chronograph",
        description: "A timeless timepiece featuring a genuine Italian leather strap, sapphire crystal glass, and Japanese quartz movement. Water-resistant up to 50 meters.",
        shortDescription: "Elegant leather strap watch with sapphire glass.",
        price: 159.00,
        comparePrice: 199.00,
        stock: 30,
        categoryId: catIds.fashion,
        images: ["/images/categories/fashion.png"],
        isFeatured: true,
        rating: 4.9,
        reviewCount: 89,
        tags: ["watch", "luxury", "fashion"],
      },
      {
        name: "Minimalist Cotton Blazer",
        slug: "minimalist-cotton-blazer",
        description: "Crafted from 100% organic cotton, this blazer offers a sharp look without sacrificing comfort. Slim fit design with premium interior lining.",
        shortDescription: "Organic cotton slim-fit blazer for a sharp, modern look.",
        price: 129.50,
        stock: 45,
        categoryId: catIds.fashion,
        images: ["/images/categories/fashion.png"],
        rating: 4.6,
        reviewCount: 56,
        tags: ["clothing", "blazer", "minimalist"],
      },
      {
        name: "Urban Elite Sneakers",
        slug: "urban-elite-sneakers",
        description: "Performance meets street style. These lightweight sneakers feature a breathable mesh upper and a responsive cushioned sole for all-day comfort.",
        shortDescription: "Stylish and comfortable sneakers for daily urban wear.",
        price: 85.00,
        comparePrice: 110.00,
        stock: 120,
        categoryId: catIds.fashion,
        images: ["/images/categories/fashion.png"],
        rating: 4.8,
        reviewCount: 167,
        tags: ["shoes", "sneakers", "streetwear"],
      },

      // Home & Living
      {
        name: "Scandi Minimalist Coffee Table",
        slug: "scandi-minimalist-coffee-table",
        description: "Beautifully crafted from solid oak with a light natural finish. This Scandinavian-inspired piece brings a touch of warmth and elegance to any modern living room.",
        shortDescription: "Solid oak coffee table with a natural Scandinavian finish.",
        price: 349.00,
        comparePrice: 450.00,
        stock: 15,
        categoryId: catIds.home,
        images: ["/images/categories/home.png"],
        isFeatured: true,
        rating: 5.0,
        reviewCount: 34,
        tags: ["furniture", "scandi", "home"],
      },
      {
        name: "Lumina Mood Lamp",
        slug: "lumina-mood-lamp",
        description: "Create the perfect atmosphere with adjustable brightness and color temperature. Features a sleek metallic base and a hand-blown glass shade.",
        shortDescription: "Smart ambient lamp with adjustable light settings.",
        price: 89.00,
        stock: 60,
        categoryId: catIds.home,
        images: ["/images/categories/home.png"],
        rating: 4.7,
        reviewCount: 92,
        tags: ["lighting", "home", "decor"],
      },
      {
        name: "Aroma Diffuser & Humidifier",
        slug: "aroma-diffuser-humidifier",
        description: "Improve your air quality and indulge in aromatherapy. Ultra-quiet operation with automatic shut-off and optional LED mood lighting.",
        shortDescription: "Quiet aroma diffuser to improve your home's air and mood.",
        price: 45.00,
        stock: 200,
        categoryId: catIds.home,
        images: ["/images/categories/home.png"],
        rating: 4.5,
        reviewCount: 143,
        tags: ["wellness", "home", "aroma"],
      },

      // Beauty
      {
        name: "Pure Glow Serum",
        slug: "pure-glow-serum",
        description: "Formulated with Hyaluronic acid and Vitamin C to brighten and hydrate your skin. Lightweight, non-greasy, and perfect for all skin types.",
        shortDescription: "Glow-enhancing serum with Vitamin C and Hyaluronic acid.",
        price: 55.00,
        comparePrice: 75.00,
        stock: 80,
        categoryId: catIds.beauty,
        images: ["/images/categories/beauty.png"],
        isFeatured: true,
        rating: 4.9,
        reviewCount: 312,
        tags: ["skincare", "beauty", "serum"],
      },
      {
        name: "Restorative Eye Cream",
        slug: "restorative-eye-cream",
        description: "Target dark circles and fine lines with our peptide-rich eye cream. Deeply nourishing and specifically designed for the delicate eye area.",
        shortDescription: "Intense nourishing cream to rejuvenate the eye area.",
        price: 42.00,
        stock: 95,
        categoryId: catIds.beauty,
        images: ["/images/categories/beauty.png"],
        rating: 4.8,
        reviewCount: 189,
        tags: ["skincare", "eye-cream", "beauty"],
      },
      {
        name: "Luxury Matte Lipstick Palette",
        slug: "luxury-matte-lipstick-palette",
        description: "Twelve highly-pigmented, long-lasting matte shades ranging from classic nudes to bold reds. Includes a professional precision brush.",
        shortDescription: "12-color premium matte lipstick palette for any occasion.",
        price: 68.00,
        comparePrice: 85.00,
        stock: 40,
        categoryId: catIds.beauty,
        images: ["/images/categories/beauty.png"],
        rating: 4.7,
        reviewCount: 201,
        tags: ["makeup", "lipstick", "luxury"],
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      counts: {
        categories: categories.length,
        products: 12,
      }
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({
      success: false,
      message: "Seeding failed.",
      error: error.message
    }, { status: 500 });
  }
}
