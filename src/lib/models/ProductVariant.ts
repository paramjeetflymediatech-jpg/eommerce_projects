import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface ProductVariantAttributes {
  id: number;
  productId: number;
  size: string; // S, M, L, XL, 7, 8, 9, 28, 30, 32, etc.
  color?: string | null;
  price?: number | null; // Optional: price override for this variant
  comparePrice?: number | null; // Optional: original/compare price for this variant
  stock: number;
  sku?: string | null;
  images?: string[] | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductVariantCreationAttributes
  extends Optional<ProductVariantAttributes, "id" | "color" | "price" | "comparePrice" | "sku"> {}

class ProductVariant
  extends Model<ProductVariantAttributes, ProductVariantCreationAttributes>
  implements ProductVariantAttributes
{
  declare id: number;
  declare productId: number;
  declare size: string;
  declare color: string | null;
  declare price: number | null;
  declare comparePrice: number | null;
  declare stock: number;
  declare sku: string | null;
  declare images: string[] | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ProductVariant.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "products", key: "id" },
    },
    size: { type: DataTypes.STRING(50), allowNull: false },
    color: { type: DataTypes.STRING(50), allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    comparePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    sku: { type: DataTypes.STRING(100), allowNull: true },
    images: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  },
  {
    sequelize,
    modelName: "ProductVariant",
    tableName: "product_variants",
    indexes: [
      { fields: ["productId"] },
      { unique: true, fields: ["sku"], name: "variants_sku_unique" },
    ],
  }
);

export default ProductVariant;
