import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import clientRoutes from "./routes/clientRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import quoteRoutes from "./routes/quoteRoutes";
import taskRoutes from "./routes/taskRoutes";
import documentRoutes from "./routes/documentRoutes";
import companyRoutes from "./routes/companyRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import revenueRoutes from "./routes/revenueRoutes";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5002;

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "documents")));

// Routes
app.use("/api/clients", clientRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/revenues", revenueRoutes);

// Gestion des routes non trouvées (404)
app.use((_, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Gestion des erreurs globales
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error("Erreur non gérée:", err);
  res.status(500).json({ error: "Une erreur interne est survenue" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
