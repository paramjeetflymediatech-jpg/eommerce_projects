import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id" | "description" | "image" | "parentId"> {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  declare id: number;
  declare name: string;
  declare slug: string;
  declare description: string;
  declare image: string;
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
    image: { type: DataTypes.STRING(500), allowNull: true },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "categories", key: "id" },
    },
  },
  { sequelize, modelName: "Category", tableName: "categories" }
);

export default Category;
