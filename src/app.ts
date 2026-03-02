import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { notFoundHandler } from "./utils/error.handler";
import { exceptionsMiddleware } from "./middlewares/exceptions.middleware";
import { requestLogger } from "./middlewares";
import { trimMiddleware } from "./middlewares/trim.middleware";
import { Alter } from "./utils/alterTables";

const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(requestLogger);

  // We trim the body of the incoming requests to remove any leading or trailing whitespace
  app.use(trimMiddleware);

  // Error handling
  // app.use(notFoundHandler);
  // app.use(errorHandler);
  // ----------------------------------------
  // Errors handler
  // @important: Should be the last `app.use`
  // ----------------------------------------

  // API routes
  app.use("/api", routes);
  app.use(exceptionsMiddleware);

  // Health check route (root level)
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
  });

  app.get("/synctables", async (req, res) => {
    try {
      // await Alter();

      res.json({ message: "Tables synced successfully" });
    } catch (error) {
      console.error("Error syncing tables:", error);
      res.status(500).json({ error: error });
    }
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
  });

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
};

export default createApp;
