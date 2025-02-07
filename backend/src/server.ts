import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes";
import path from "path";
import testRoutes from "./routes/testRoutes";
import { initializeDatabase } from "./config/database";
import listEndpoints from "express-list-endpoints";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5002;

// Initialisation de la base de données
(async () => {
  try {
    await initializeDatabase();
    console.log("Connexion à la base de données réussie");
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données :",
      error
    );
    process.exit(1); // Arrête le serveur si la base de données ne peut pas se connecter
  }
})();

// Middleware pour rendre le dossier "uploads" accessible via "/uploads"
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
console.log(
  "Dossier uploads accessible sur :",
  path.join(__dirname, "../uploads")
);

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

// Routes API de base
app.use("/api", routes);

// Route spécifique pour les tests
app.use("/api", testRoutes);

// Ajout des routes supplémentaires si manquantes
app.get("/api/folders", (req, res) => {
  res.json({
    folders: [
      { id: 1, name: "Documents" },
      { id: 2, name: "Images" },
    ],
  });
});

app.get("/api/statistics", (req, res) => {
  res.json({ users: 100, documents: 50, invoices: 10 });
});

// Gestion des routes non trouvées
app.use((req, res) => {
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

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

console.log(listEndpoints(app));
