import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { createServer } from "http";
import cors from "cors";

// Force development mode
process.env.NODE_ENV = "development";

function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [express] ${message}`);
}

const app = express();

// Enable CORS for all origins in development
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add health check endpoint
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  log(`${req.method} ${req.path} - Started`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.path} ${res.statusCode} - Completed in ${duration}ms`);
  });

  next();
});

(async () => {
  try {
    // Register API routes first
    registerRoutes(app);
    const server = createServer(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Error:", err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Setup Vite in development mode
    await setupVite(app, server);

    const PORT = Number(process.env.PORT) || 5000;
    const HOST = "0.0.0.0";

    server.listen(PORT, HOST, () => {
      log(`Server running at http://${HOST}:${PORT}`);
      log(`Environment: ${process.env.NODE_ENV}`);
      log("Ready to accept connections");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
