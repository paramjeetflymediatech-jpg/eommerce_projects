import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface OrderAttributes {
  id: number;
  userId: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  stripePaymentId?: string;
  stripeSessionId?: string;
  trackingId?: string;
  carrier?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes
  extends Optional<OrderAttributes, "id" | "stripePaymentId" | "stripeSessionId" | "trackingId" | "carrier" | "notes"> {}

class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  declare id: number;
  declare userId: number;
  declare status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  declare total: number;
  declare shippingAddress: OrderAttributes["shippingAddress"];
  declare stripePaymentId: string;
  declare stripeSessionId: string;
  declare trackingId: string;
  declare carrier: string;
  declare notes: string;
  declare user?: { name: string; email: string };
  declare items?: any[];
  declare createdAt: Date;
  declare updatedAt: Date;
}

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    status: {
      type: DataTypes.ENUM("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"),
      defaultValue: "PENDING",
    },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    shippingAddress: { type: DataTypes.JSON, allowNull: false },
    stripePaymentId: { type: DataTypes.STRING(255), allowNull: true },
    stripeSessionId: { type: DataTypes.STRING(255), allowNull: true },
    trackingId: { type: DataTypes.STRING(255), allowNull: true },
    carrier: { type: DataTypes.STRING(255), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: "Order", tableName: "orders" }
);

export default Order;
