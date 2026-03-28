import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface ReviewAttributes {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  title?: string;
  comment: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ReviewCreationAttributes
  extends Optional<ReviewAttributes, "id" | "title" | "isVerified"> {}

class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes
{
  declare id: number;
  declare userId: number;
  declare productId: number;
  declare rating: number;
  declare title: string;
  declare comment: string;
  declare isVerified: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Review.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "products", key: "id" },
    },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    title: { type: DataTypes.STRING(200), allowNull: true },
    comment: { type: DataTypes.TEXT, allowNull: false },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: "Review", tableName: "reviews" }
);

export default Review;
