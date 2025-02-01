import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import { RowDataPacket } from "mysql2";

// Obtenir tous les revenus
export const getAllRevenues = async (req: Request, res: Response) => {
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

// Obtenir les revenus par année
export const getYearlyRevenue = async (req: Request, res: Response) => {
  const { year } = req.params;

  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT SUM(amount) as totalAmount
       FROM revenues
       WHERE year = ?`,
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

// Obtenir les revenus par mois
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

// Obtenir les statistiques des revenus
export const getRevenueStats = async (req: Request, res: Response) => {
  try {
    // Obtenir le total des revenus
    const [totalRows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT SUM(amount) as total FROM revenues"
    );

    // Obtenir la moyenne mensuelle
    const [avgRows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT AVG(amount) as average FROM revenues"
    );

    // Obtenir le meilleur mois
    const [bestMonthRows] = await DatabaseServices.executeQuery<
      RowDataPacket[]
    >(
      `SELECT year, month, amount
       FROM revenues
       ORDER BY amount DESC
       LIMIT 1`
    );

    // Calculer la croissance par rapport au mois précédent
    const [growthRows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT 
        current.amount as currentAmount,
        prev.amount as prevAmount
       FROM revenues current
       LEFT JOIN revenues prev ON (
         (current.year = prev.year AND current.month = prev.month + 1)
         OR (current.year = prev.year + 1 AND current.month = 1 AND prev.month = 12)
       )
       ORDER BY current.year DESC, current.month DESC
       LIMIT 1`
    );

    const growth = growthRows[0]
      ? ((growthRows[0].currentAmount - growthRows[0].prevAmount) /
          growthRows[0].prevAmount) *
        100
      : 0;

    res.json({
      total: totalRows[0].total || 0,
      average: avgRows[0].average || 0,
      bestMonth: bestMonthRows[0] || null,
      growth: growth,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
