import { Request, Response } from "express";
import { executeQuery } from "../config/database";

// Interface pour représenter les données de revenus
interface RevenueData {
  clientId: number;
  amount: number;
  dateReceived: string;
  description?: string;
}

// Fonction de validation des données de revenus
function validateRevenueData(revenueData: RevenueData): string[] {
  const errors: string[] = [];

  if (!revenueData.clientId || isNaN(revenueData.clientId))
    errors.push("L'ID du client est requis et doit être un nombre valide");
  if (!revenueData.amount || isNaN(revenueData.amount))
    errors.push("Le montant est requis et doit être un nombre valide");
  if (!revenueData.dateReceived || !validateDate(revenueData.dateReceived))
    errors.push("Une date de réception valide est requise");

  return errors;
}

// Validation de la date
function validateDate(date: string): boolean {
  return !isNaN(Date.parse(date));
}

export const getAllRevenues = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const revenues = await executeQuery<RevenueData[]>(
      "SELECT * FROM revenues"
    );
    res.status(200).json(revenues);
  } catch (error) {
    console.error("Erreur lors de la récupération des revenus :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la récupération des revenus",
      });
  }
};

export const getRevenueById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const revenueId = parseInt(req.params.id);
    const revenue = await executeQuery<RevenueData[]>(
      "SELECT * FROM revenues WHERE id = ?",
      [revenueId]
    );
    if (revenue.length === 0) {
      res.status(404).json({ error: "Revenu non trouvé" });
      return;
    }
    res.status(200).json(revenue[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du revenu :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la récupération du revenu",
      });
  }
};

export const createRevenue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const revenueData: RevenueData = req.body;
    const validationErrors = validateRevenueData(revenueData);

    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    await executeQuery(
      "INSERT INTO revenues (clientId, amount, dateReceived, description) VALUES (?, ?, ?, ?)",
      [
        revenueData.clientId,
        revenueData.amount,
        revenueData.dateReceived,
        revenueData.description,
      ]
    );

    res.status(201).json({ message: "Revenu créé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la création du revenu :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la création du revenu",
      });
  }
};

export const updateRevenue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const revenueId = parseInt(req.params.id);
    const revenueData: Partial<RevenueData> = req.body;
    if (Object.keys(revenueData).length === 0) {
      res
        .status(400)
        .json({ error: "Aucune donnée fournie pour la mise à jour" });
      return;
    }

    await executeQuery(
      "UPDATE revenues SET clientId = ?, amount = ?, dateReceived = ?, description = ? WHERE id = ?",
      [
        revenueData.clientId,
        revenueData.amount,
        revenueData.dateReceived,
        revenueData.description,
        revenueId,
      ]
    );

    res.status(200).json({ message: "Revenu mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du revenu :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la mise à jour du revenu",
      });
  }
};

export const deleteRevenue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const revenueId = parseInt(req.params.id);

    await executeQuery("DELETE FROM revenues WHERE id = ?", [revenueId]);
    res.status(200).json({ message: "Revenu supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du revenu :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la suppression du revenu",
      });
  }
};
