import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface OrderItemAttributes {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;
  productName: string;
  productImage?: string;
  variantId?: number | null;
  variantSize?: string | null;
  variantColor?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderItemCreationAttributes
  extends Optional<OrderItemAttributes, "id" | "productImage" | "variantId" | "variantSize" | "variantColor"> {}

class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes
{
  declare id: number;
  declare orderId: number;
  declare productId: number;
  declare quantity: number;
  declare priceAtPurchase: number;
  declare productName: string;
  declare productImage: string;
  declare variantId: number | null;
  declare variantSize: string | null;
  declare variantColor: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

OrderItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "orders", key: "id" },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "products", key: "id" },
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    priceAtPurchase: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    productName: { type: DataTypes.STRING(200), allowNull: false },
    productImage: { type: DataTypes.STRING(500), allowNull: true },
    variantId: { type: DataTypes.INTEGER, allowNull: true },
    variantSize: { type: DataTypes.STRING(50), allowNull: true },
    variantColor: { type: DataTypes.STRING(50), allowNull: true },
  },
  { sequelize, modelName: "OrderItem", tableName: "order_items" }
);

export default OrderItem;
