import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "ecommerce",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD ?? "",   // use empty string if not set — do NOT fallback to "root"
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: false,
      timestamps: true,
    },
  }
);

export default sequelize;
