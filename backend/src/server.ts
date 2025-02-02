import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import clientRoutes from "./routes/clientRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import taskRoutes from "./routes/taskRoutes";
import testRoutes from "./routes/testRoutes"; // Import the test routes
import documentRoutes from "./routes/documentRoutes"; // Import the document routes
import companyRoutes from "./routes/companyRoutes"; // Import the company routes
import paymentRoutes from "./routes/paymentRoutes"; // Import the payment routes
import revenueRoutes from "./routes/revenueRoutes"; // Import the revenue routes
import { testDatabaseConnection } from "./config/database";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5002;

// Middlewares
app.use(cors());
app.use(helmet()); // Sécurisation des en-têtes HTTP
app.use(morgan("dev")); // Logging des requêtes
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "..", "documents"))); // Serveur statique pour les documents

// Routes
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/test", testRoutes); // Use the test routes
app.use("/api/documents", documentRoutes); // Use the document routes
app.use("/api/company", companyRoutes); // Use the company routes
app.use("/api/payments", paymentRoutes); // Use the payment routes
app.use("/api/revenues", revenueRoutes); // Use the revenue routes

// Route de santé
app.get("/api/health", async (req, res) => {
  try {
    const dbConnected = await testDatabaseConnection();
    res.json({
      status: "OK",
      database: dbConnected ? "connected" : "disconnected", // Simplified status
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Connection check failed",
    });
  }
});

// Gestion des routes non trouvées (404)
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Gestion des erreurs globales
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Erreur non gérée:", err);
    res.status(500).json({ error: "Une erreur interne est survenue" });
  }
);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
