import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface CartAttributes {
  id: number;
  userId?: number | null;
  sessionId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CartCreationAttributes extends Optional<CartAttributes, "id" | "userId" | "sessionId"> {}

class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  declare id: number;
  declare userId: number | null;
  declare sessionId: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Cart.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
    sessionId: { type: DataTypes.STRING(255), allowNull: true },
  },
  { sequelize, modelName: "Cart", tableName: "carts" }
);

export default Cart;
