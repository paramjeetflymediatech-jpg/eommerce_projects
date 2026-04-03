import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  passwordHash?: string | null;
  role: "USER" | "ADMIN";
  avatar?: string;
  isVerified: boolean;
  googleId?: string | null;
  otp?: string | null;
  otpExpiry?: Date | null;
  token?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "role" | "avatar" | "isVerified" | "googleId" | "otp" | "otpExpiry" | "token" | "passwordHash"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare passwordHash: string | null;
  declare role: "USER" | "ADMIN";
  declare avatar: string;
  declare isVerified: boolean;
  declare googleId: string | null;
  declare otp: string | null;
  declare otpExpiry: Date | null;
  declare token: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false },
    passwordHash: { type: DataTypes.STRING(255), allowNull: true },
    role: { type: DataTypes.ENUM("USER", "ADMIN"), defaultValue: "USER" },
    avatar: { type: DataTypes.STRING(500), allowNull: true },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    googleId: { type: DataTypes.STRING(150), allowNull: true },
    otp: { type: DataTypes.STRING(6), allowNull: true },
    otpExpiry: { type: DataTypes.DATE, allowNull: true },
    token: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    indexes: [
      { unique: true, fields: ["email"], name: "users_email_unique" },
      { unique: true, fields: ["googleId"], name: "users_googleId_unique" },
    ],
  }
);

export default User;
