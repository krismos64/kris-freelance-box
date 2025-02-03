import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import { RowDataPacket } from "mysql2";

export const getAllRevenues = async (_req: Request, res: Response) => {
  try {
    const revenues = await DatabaseServices.getAllRevenues();
    res.json(revenues);
  } catch (error) {
    console.error("Erreur lors de la récupération des revenus:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getYearlyRevenue = async (_req: Request, res: Response) => {
  const { year } = _req.params;
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT SUM(amount) as totalAmount
       FROM payments
       WHERE YEAR(paymentDate) = ? AND status = 'payé'`,
      [year]
    );

    res.json({
      year,
      totalAmount: rows[0].totalAmount || 0,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du revenu annuel:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getMonthlyRevenue = async (_req: Request, res: Response) => {
  const { year, month } = _req.params;
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT SUM(amount) as totalAmount
       FROM payments
       WHERE YEAR(paymentDate) = ? 
       AND MONTH(paymentDate) = ?
       AND status = 'payé'`,
      [year, month]
    );

    res.json({
      year,
      month,
      amount: rows[0].totalAmount || 0,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du revenu mensuel:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getRevenueStats = async (_req: Request, res: Response) => {
  try {
    // Total des revenus
    const [totalRows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT SUM(amount) as total
       FROM payments
       WHERE status = 'payé'`
    );

    // Moyenne mensuelle
    const [avgRows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT AVG(monthly_total) as average
       FROM (
         SELECT SUM(amount) as monthly_total
         FROM payments
         WHERE status = 'payé'
         GROUP BY YEAR(paymentDate), MONTH(paymentDate)
       ) as monthly_totals`
    );

    // Meilleur mois
    const [bestMonthRows] = await DatabaseServices.executeQuery<
      RowDataPacket[]
    >(
      `SELECT 
        YEAR(paymentDate) as year,
        MONTH(paymentDate) as month,
        SUM(amount) as amount
       FROM payments
       WHERE status = 'payé'
       GROUP BY YEAR(paymentDate), MONTH(paymentDate)
       ORDER BY amount DESC
       LIMIT 1`
    );

    res.json({
      total: totalRows[0].total || 0,
      average: avgRows[0].average || 0,
      bestMonth: bestMonthRows[0] || null,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
