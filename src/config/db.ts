import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_PORT,
} = process.env;

const db = new Sequelize(
  DATABASE_NAME || "",
  DATABASE_USER || "",
  DATABASE_PASSWORD || "",
  {
    host: DATABASE_HOST || "localhost",
    port: Number(DATABASE_PORT) || 5432,
    dialect: "postgres",
    logging: false,
  },
);

export default db