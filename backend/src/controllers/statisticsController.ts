import { Request, Response } from "express";
import { executeQuery } from "../config/database";

// Endpoint pour les revenus
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

// Endpoint pour les statistiques des clients
interface ClientStats {
  count: number;
}

export const getClientStats = async (req: Request, res: Response) => {
  try {
    const result = await executeQuery<ClientStats[]>(
      `SELECT COUNT(*) AS count FROM clients`
    );
    res.json(result[0]);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques clients :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la récupération des statistiques clients",
    });
  }
};

// Endpoint pour les statistiques des tâches
interface TaskStats {
  incompleteTasks: number;
}

export const getTaskStats = async (req: Request, res: Response) => {
  try {
    const result = await executeQuery<TaskStats[]>(
      `SELECT COUNT(*) AS incompleteTasks FROM tasks WHERE status = 'incomplete'`
    );
    res.json(result[0]);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques des tâches :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la récupération des statistiques des tâches",
    });
  }
};

// Endpoint pour les statistiques des factures
interface InvoiceStats {
  count: number;
  quoteCount: number;
  averageValue: number;
}

export const getInvoiceStats = async (req: Request, res: Response) => {
  try {
    const result = await executeQuery<InvoiceStats[]>(`
      SELECT 
        COUNT(*) AS count,
        (SELECT COUNT(*) FROM quotes) AS quoteCount,
        AVG(amount) AS averageValue
      FROM invoices
    `);
    res.json(result[0]);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques des factures :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la récupération des statistiques des factures",
    });
  }
};
