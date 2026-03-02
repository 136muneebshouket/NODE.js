import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'node_ts_template',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    // define: {
    //   // Global model options
    //   underscored: true,
    //   paranoid: true,
    //   timestamps: true,
    // },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : {},
  }
);

export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;