import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import db from "../models/index";
dotenv.config();

let sequelize: Sequelize;

export const testConnection = async (): Promise<void> => {
  try {
    sequelize = db.sequelize;
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

export { sequelize };
