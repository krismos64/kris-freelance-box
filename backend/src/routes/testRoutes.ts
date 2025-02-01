import express from "express";
import { testDatabaseConnection } from "../config/database";

const router = express.Router();

router.get("/db", async (req, res) => {
  try {
    const isConnected = await testDatabaseConnection();
    res.json({ isConnected });
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error);
    res.status(500).json({ isConnected: false, error: "Erreur de connexion" });
  }
});

export default router;
