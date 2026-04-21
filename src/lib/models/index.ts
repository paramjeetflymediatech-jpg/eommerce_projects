import sequelize from "../sequelize";
import User from "./User";
import Category from "./Category";
import Product from "./Product";
import Order from "./Order";
import OrderItem from "./OrderItem";
import Review from "./Review";
import Cart from "./Cart";
import CartItem from "./CartItem";
import Address from "./Address";
import WishlistItem from "./WishlistItem";
import Migration from "./Migration";
import ProductVariant from "./ProductVariant";
import Coupon from "./Coupon";

// ── Associations ─────────────────────────────────────────────────────────────

// Category self-referencing
Category.hasMany(Category, { foreignKey: "parentId", as: "children" });
Category.belongsTo(Category, { foreignKey: "parentId", as: "parent" });

// Category <-> Product
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// User <-> Order
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Product <-> OrderItem
Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Product <-> ProductVariant
Product.hasMany(ProductVariant, { foreignKey: "productId", as: "variants", onDelete: "CASCADE" });
ProductVariant.belongsTo(Product, { foreignKey: "productId", as: "product" });

// User <-> Review
User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

// Product <-> Review
Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "productId", as: "product" });

// User <-> Cart
User.hasOne(Cart, { foreignKey: "userId", as: "cart" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

// Cart <-> CartItem
Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

// Product <-> CartItem
Product.hasMany(CartItem, { foreignKey: "productId" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// User <-> Address
User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

// User <-> WishlistItem (many-to-many via WishlistItem table)
User.hasMany(WishlistItem, { foreignKey: "userId", as: "wishlistItems" });
WishlistItem.belongsTo(User, { foreignKey: "userId", as: "user" });
Product.hasMany(WishlistItem, { foreignKey: "productId", as: "wishlistedBy" });
WishlistItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

import mysql from "mysql2/promise";

// ── Sync ─────────────────────────────────────────────────────────────────────
let dbReady = false;
let syncPromise: Promise<void> | null = null;

export const syncDB = async () => {
  if (syncPromise) return syncPromise;

  syncPromise = (async () => {
    try {
      await sequelize.authenticate();
      // alter:true safely adds new columns/indexes without dropping existing data
      await sequelize.sync({ alter: true });
      dbReady = true;
    } catch (error) {
      console.error("❌ DB sync error:", error);
      syncPromise = null; // allow retry on next request
      throw error;
    }
  })();

  return syncPromise;
};

/**
 * Ensures the database is initialized and synced.
 * Safe to call at the top of any API route — runs only once.
 */
export async function ensureDB() {
  if (dbReady) return;
  await syncDB();
}

export {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Review,
  Cart,
  CartItem,
  Address,
  WishlistItem,
  Migration,
  ProductVariant,
  Coupon,
};

