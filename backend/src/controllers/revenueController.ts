import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import { RowDataPacket } from "mysql2";

export const getRevenues = async (req: Request, res: Response) => {
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT 
        year,
        month,
        amount,
        lastUpdated
      FROM revenues
      ORDER BY year DESC, month DESC`
    );

    // Formater les données pour l'affichage
    const formattedRevenues = rows.map((row) => ({
      ...row,
      monthName: new Date(row.year, row.month - 1).toLocaleString("fr-FR", {
        month: "long",
      }),
    }));

    res.json(formattedRevenues);
  } catch (error) {
    console.error("Erreur lors de la récupération des revenus:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getYearlyRevenue = async (req: Request, res: Response) => {
  const { year } = req.params;

  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT SUM(amount) as totalAmount
       FROM revenues
       WHERE year = ?`,
      [year]
    );

    res.json({ year, totalAmount: rows[0].totalAmount || 0 });
  } catch (error) {
    console.error("Erreur lors de la récupération du revenu annuel:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getMonthlyRevenue = async (req: Request, res: Response) => {
  const { year, month } = req.params;

  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT amount
       FROM revenues
       WHERE year = ? AND month = ?`,
      [year, month]
    );

    res.json({
      year,
      month,
      monthName: new Date(parseInt(year), parseInt(month) - 1).toLocaleString(
        "fr-FR",
        { month: "long" }
      ),
      amount: rows[0]?.amount || 0,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du revenu mensuel:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
