import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface AddressAttributes {
  id: number;
  userId: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AddressCreationAttributes
  extends Optional<AddressAttributes, "id" | "isDefault"> {}

class Address
  extends Model<AddressAttributes, AddressCreationAttributes>
  implements AddressAttributes
{
  declare id: number;
  declare userId: number;
  declare name: string;
  declare street: string;
  declare city: string;
  declare state: string;
  declare zip: string;
  declare country: string;
  declare phone: string;
  declare isDefault: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Address.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    street: { type: DataTypes.STRING(255), allowNull: false },
    city: { type: DataTypes.STRING(100), allowNull: false },
    state: { type: DataTypes.STRING(100), allowNull: false },
    zip: { type: DataTypes.STRING(20), allowNull: false },
    country: { type: DataTypes.STRING(100), allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: "Address", tableName: "addresses" }
);

export default Address;
