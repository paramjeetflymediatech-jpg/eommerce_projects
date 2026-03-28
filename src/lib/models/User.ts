import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "USER" | "ADMIN";
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "role" | "avatar"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare role: "USER" | "ADMIN";
  declare avatar: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM("USER", "ADMIN"), defaultValue: "USER" },
    avatar: { type: DataTypes.STRING(500), allowNull: true },
  },
  { sequelize, modelName: "User", tableName: "users" }
);

export default User;
