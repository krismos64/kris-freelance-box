import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5002;

// Vérification des variables d'environnement
if (!process.env.SERVER_PORT) {
  console.error("⚠️  SERVER_PORT n'est pas défini dans le fichier .env");
  process.exit(1);
}

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "documents")));

// Routes
app.use("/api", routes);

// Gestion des routes non trouvées (404)
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: `Route non trouvée: ${req.originalUrl}` });
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
    res
      .status(500)
      .json({ error: err.message || "Une erreur interne est survenue" });
  }
);

// Gestion des exceptions non gérées
process.on("uncaughtException", (error) => {
  console.error("Erreur fatale non gérée :", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Promesse rejetée sans gestion :", reason);
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
