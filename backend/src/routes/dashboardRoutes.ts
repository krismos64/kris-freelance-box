import { Router } from "express";

const router = Router();

// Données fictives pour les revenus
const revenueData = [
  { monthName: "Janvier", amount: 1000 },
  { monthName: "Février", amount: 1200 },
  { monthName: "Mars", amount: 900 },
  { monthName: "Avril", amount: 1500 },
];

// Endpoint pour récupérer les revenus mensuels
router.get("/revenues", (req, res) => {
  res.json(revenueData);
});

// Données fictives pour les statistiques des clients
const clientStats = { count: 35 };

// Endpoint pour les statistiques des clients
router.get("/clients/stats", (req, res) => {
  res.json(clientStats);
});

// Données fictives pour les tâches
const taskStats = { incompleteTasks: 12 };

// Endpoint pour les statistiques des tâches
router.get("/tasks/stats", (req, res) => {
  res.json(taskStats);
});

export default router;
