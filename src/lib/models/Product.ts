import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface ProductAttributes {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[]; // stored as JSON
  categoryId: number;
  tags?: string[]; // stored as JSON
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    | "id"
    | "shortDescription"
    | "comparePrice"
    | "tags"
    | "rating"
    | "reviewCount"
    | "isFeatured"
    | "isActive"
  > {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: number;
  declare name: string;
  declare slug: string;
  declare description: string;
  declare shortDescription: string;
  declare price: number;
  declare comparePrice: number;
  declare stock: number;
  declare images: string[];
  declare categoryId: number;
  declare tags: string[];
  declare rating: number;
  declare reviewCount: number;
  declare isFeatured: boolean;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Product.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    slug: { type: DataTypes.STRING(220), allowNull: false, unique: "products_slug_unique" },
    description: { type: DataTypes.TEXT, allowNull: false },
    shortDescription: { type: DataTypes.STRING(500), allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    comparePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "categories", key: "id" },
    },
    tags: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
    rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
    reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, modelName: "Product", tableName: "products" }
);

export default Product;
