import dotenv from "dotenv";
import { resolve } from "path";
// @ts-ignore
import pg from "pg";

// Load environment variables from .env file
dotenv.config({ path: resolve(process.cwd(), ".env") });

// Define and export environment variables with type safety
const env = {
  isProduction: process.env.PRODUCTION == 'true',
  server: {
    port: parseInt(process.env.PORT || "8000", 10),
  },
  redis: {
    // url: process.env.REDIS_URL || 'redis://localhost:6379',
    host: process.env.REDIS_HOST, // Replace with your Redis server's hostname or IP
    port: Number(process.env.REDIS_PORT), // Replace with your Redis server's port (default: 6379)
    password: process.env.REDIS_PASSWORD,
  },
  gbg: {
    basePath: process.env.GBG_BASEPATH,
    basePath2: process.env.GBG_BASEPATH2,
    username: process.env.GBG_USERNAME,
    password: process.env.GBG_PASSWORD,
    enviroment: process.env.GBG_ENVIROMENT,
  },
  mail: {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
  },
  jwt: {
    secretAccessKey: process.env.JWT_ACCESS_SECRET,
    secretRefreshKey: process.env.JWT_REFRESH_SECRET,
    // expiresIn: process.env.JWT_EXPIRES_IN,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishKey: process.env.STRIPE_PUBLISH_KEY,
    webhookSecret: process.env.WEBHOOK_SECRET,
  },
  adminMail: String(process.env.ADMIN_MAIL),
  FrontendUrl: String(process.env.FRONTEND_URL),

  cloudinary: {
    cloudName: String(process.env.CLOUDINARY_NAME),
    apiKey: String(process.env.CLOUDINARY_API_KEY),
    secret: String(process.env.CLOUDINARY_SECRET),
  },
  google_auth: {
    clientID: String(process.env.GOOGLE_CLIENT_ID),
    clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    callbackURL: String(process.env.GOOGLE_CALLBACK_URL),
  },
};

export default env;
