import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface CouponAttributes {
  id: number;
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate?: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CouponCreationAttributes
  extends Optional<
    CouponAttributes,
    | "id"
    | "description"
    | "minOrderAmount"
    | "maxDiscountAmount"
    | "expiryDate"
    | "usageLimit"
    | "usedCount"
    | "isActive"
  > {}

class Coupon
  extends Model<CouponAttributes, CouponCreationAttributes>
  implements CouponAttributes
{
  declare id: number;
  declare code: string;
  declare description: string;
  declare discountType: "PERCENTAGE" | "FIXED";
  declare discountValue: number;
  declare minOrderAmount: number;
  declare maxDiscountAmount: number;
  declare expiryDate: Date;
  declare usageLimit: number;
  declare usedCount: number;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Coupon.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: "coupons_code_unique" },
    description: { type: DataTypes.STRING(255), allowNull: true },
    discountType: {
      type: DataTypes.ENUM("PERCENTAGE", "FIXED"),
      allowNull: false,
      defaultValue: "FIXED",
    },
    discountValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    minOrderAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
    maxDiscountAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    expiryDate: { type: DataTypes.DATE, allowNull: true },
    usageLimit: { type: DataTypes.INTEGER, allowNull: true },
    usedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, modelName: "Coupon", tableName: "coupons" }
);

export default Coupon;
