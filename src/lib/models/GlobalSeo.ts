import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class GlobalSeo extends Model {
  public id!: number;
  public businessName?: string;
  public logoUrl?: string;
  public phoneNumber?: string;
  public emailAddress?: string;
  public businessDescription?: string;
  
  public streetAddress?: string;
  public city?: string;
  public state?: string;
  public postalCode?: string;
  public countryCode?: string;
  public latitude?: string;
  public longitude?: string;
  
  // JSON array of URLs
  public socialProfileUrls?: string;

  public googleAnalyticsId?: string;
  public googleTagManagerId?: string;

  public customGlobalSchema?: string;
  public headerScripts?: string;
  public footerScripts?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

GlobalSeo.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    businessName: { type: DataTypes.STRING, allowNull: true },
    logoUrl: { type: DataTypes.STRING, allowNull: true },
    phoneNumber: { type: DataTypes.STRING, allowNull: true },
    emailAddress: { type: DataTypes.STRING, allowNull: true },
    businessDescription: { type: DataTypes.TEXT, allowNull: true },
    
    streetAddress: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    postalCode: { type: DataTypes.STRING, allowNull: true },
    countryCode: { type: DataTypes.STRING, allowNull: true },
    latitude: { type: DataTypes.STRING, allowNull: true },
    longitude: { type: DataTypes.STRING, allowNull: true },
    
    socialProfileUrls: { type: DataTypes.TEXT, allowNull: true },

    googleAnalyticsId: { type: DataTypes.STRING, allowNull: true },
    googleTagManagerId: { type: DataTypes.STRING, allowNull: true },

    customGlobalSchema: { type: DataTypes.TEXT("long"), allowNull: true },
    headerScripts: { type: DataTypes.TEXT("long"), allowNull: true },
    footerScripts: { type: DataTypes.TEXT("long"), allowNull: true },
  },
  {
    sequelize,
    modelName: "GlobalSeo",
    tableName: "GlobalSeos",
  }
);

export default GlobalSeo;
