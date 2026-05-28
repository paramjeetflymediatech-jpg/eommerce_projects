import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  description?: string;
  tagline?: string;
  overlayDescription?: string;
  image?: string;
  banner?: string;
  parentId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id" | "description" | "tagline" | "overlayDescription" | "image" | "banner" | "parentId"> {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  declare id: number;
  declare name: string;
  declare slug: string;
  declare description: string;
  declare tagline: string;
  declare overlayDescription: string;
  declare image: string;
  declare banner: string;
  declare parentId: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Category.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    slug: { type: DataTypes.STRING(120), allowNull: false, unique: "categories_slug_unique" },
    description: { type: DataTypes.TEXT, allowNull: true },
    tagline: { type: DataTypes.STRING(200), allowNull: true },
    overlayDescription: { type: DataTypes.STRING(500), allowNull: true },
    image: { type: DataTypes.STRING(500), allowNull: true },
    banner: { type: DataTypes.STRING(500), allowNull: true },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "categories", key: "id" },
    },
  },
  { sequelize, modelName: "Category", tableName: "categories" }
);

export default Category;
