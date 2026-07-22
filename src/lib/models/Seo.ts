import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class Seo extends Model {
  public id!: number;
  public pagePath!: string;
  public seoTitle?: string;
  public metaDescription?: string;
  public keywords?: string;
  public canonicalUrl?: string;
  public metaRobots?: string;
  public twitterCard?: string;
  public customSchema?: string;
  public ogTitle?: string;
  public ogImageUrl?: string;
  public ogDescription?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Seo.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    pagePath: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    seoTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    keywords: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    canonicalUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaRobots: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Index, Follow",
    },
    twitterCard: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customSchema: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    ogTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ogImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ogDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Seo",
    tableName: "Seos",
  }
);

export default Seo;
