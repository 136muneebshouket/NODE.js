import "dotenv/config";
import createApp from "./app";
import _sequelize, { testConnection } from "./config/database";
import redis from "./services/redis.service";

const PORT = process.env.PORT || 8000;

const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    await testConnection();
    console.log("✅ Database connection established successfully.");
    
    // Test Redis connection (before starting the server add redis env variables in .env file)
    // await redis.isReady();



    // // Sync database (use with caution in production)
    // // In production, use migrations instead
    if (process.env.NODE_ENV === "development") {
      const { syncModels } = await import("./models");
      await syncModels(false);
      console.log("✅ Database synced successfully.");
    }

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

startServer();
