import { Router } from "express";
import { executeQuery } from "../config/database";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

router.get("/test/db", async (req, res) => {
  try {
    // Exemple de requête test pour la base de données
    await executeQuery("SELECT 1");
    res.status(200).json({ isConnected: true });
  } catch (error) {
    console.error("Erreur de connexion à la base de données :", error);
    res.status(500).json({ error: "Erreur de connexion à la base de données" });
  }
});

export default router;
