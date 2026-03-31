import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

/**
 * Migration log — tracks which DB migrations have been applied.
 * Every schema change should add a row here.
 */
export interface MigrationAttributes {
  id: number;
  name: string;          // e.g. "001_add_otp_fields_to_users"
  appliedAt: Date;
}

interface MigrationCreationAttributes extends Optional<MigrationAttributes, "id" | "appliedAt"> {}

class Migration
  extends Model<MigrationAttributes, MigrationCreationAttributes>
  implements MigrationAttributes
{
  declare id: number;
  declare name: string;
  declare appliedAt: Date;
}

Migration.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    appliedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { sequelize, modelName: "Migration", tableName: "migrations", timestamps: false }
);

export default Migration;
