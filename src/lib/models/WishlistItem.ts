import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

// Join table for Wishlist <-> Product many-to-many
export interface WishlistItemAttributes {
  id: number;
  userId: number;
  productId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WishlistItemCreationAttributes extends Optional<WishlistItemAttributes, "id"> {}

class WishlistItem
  extends Model<WishlistItemAttributes, WishlistItemCreationAttributes>
  implements WishlistItemAttributes
{
  declare id: number;
  declare userId: number;
  declare productId: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

WishlistItem.init(
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
  },
  { sequelize, modelName: "WishlistItem", tableName: "wishlist_items" }
);

export default WishlistItem;
