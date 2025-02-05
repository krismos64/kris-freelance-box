import { Request, Response } from "express";
import { executeQuery } from "../config/database";
// Exemple : récupérer les revenus
export const getRevenues = async (req: Request, res: Response) => {
  try {
    const revenues = await executeQuery(
      `SELECT monthName, amount FROM revenues ORDER BY monthName`
    );
    res.json(revenues);
  } catch (error) {
    console.error("Erreur lors de la récupération des revenus :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des revenus" });
  }
};

interface ClientStatsResult {
  totalClients: number;
}

// Exemple : récupérer les statistiques des clients
export const getClientStats = async (req: Request, res: Response) => {
  try {
    const result = (await executeQuery(
      `SELECT COUNT(*) as totalClients FROM clients`
    )) as ClientStatsResult[];
    res.json({ totalClients: result[0].totalClients });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques clients :",
      error
    );
    res
      .status(500)
      .json({
        error: "Erreur lors de la récupération des statistiques clients",
      });
  }
};

interface TaskStatsResult {
  totalTasks: number;
  incompleteTasks: number;
}

// Exemple : récupérer les statistiques des tâches
export const getTaskStats = async (req: Request, res: Response) => {
  try {
    const result = (await executeQuery(
      `SELECT COUNT(*) as totalTasks, 
              COUNT(CASE WHEN status = 'incomplete' THEN 1 END) as incompleteTasks 
       FROM tasks`
    )) as TaskStatsResult[];
    res.json(result[0]);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques des tâches :",
      error
    );
    res
      .status(500)
      .json({
        error: "Erreur lors de la récupération des statistiques des tâches",
      });
  }
};
