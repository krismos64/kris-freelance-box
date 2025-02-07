import { Router } from "express";
import { executeQuery } from "../config/database";

const router = Router();

router.get("/db", async (req, res) => {
  try {
    await executeQuery("SELECT 1"); // Requête de test
    res.status(200).json({ message: "Connexion à la base de données réussie" });
  } catch (error) {
    console.error("Erreur de connexion à la base de données :", error);
    res.status(500).json({ error: "Erreur de connexion à la base de données" });
  }
});

export default router;
