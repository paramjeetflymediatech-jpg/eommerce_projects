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
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderItemCreationAttributes
  extends Optional<OrderItemAttributes, "id" | "productImage"> {}

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
  },
  { sequelize, modelName: "OrderItem", tableName: "order_items" }
);

export default OrderItem;
