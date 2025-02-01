import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import clientRoutes from "./routes/clientRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import taskRoutes from "./routes/taskRoutes";
import { testDatabaseConnection } from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5001;

// Middlewares
app.use(cors());
app.use(helmet()); // Sécurisation des en-têtes HTTP
app.use(morgan("dev")); // Logging des requêtes
app.use(express.json());

// Routes
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/tasks", taskRoutes);

// Route de santé
app.get("/api/health", async (req, res) => {
  try {
    const dbConnected = await testDatabaseConnection();
    res.json({
      status: "OK",
      database: dbConnected ? "Connected" : "Disconnected",
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Impossible de vérifier la connexion",
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
