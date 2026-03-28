import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface CartItemAttributes {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, "id"> {}

class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  declare id: number;
  declare cartId: number;
  declare productId: number;
  declare quantity: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CartItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "carts", key: "id" },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "products", key: "id" },
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  },
  { sequelize, modelName: "CartItem", tableName: "cart_items" }
);

export default CartItem;
