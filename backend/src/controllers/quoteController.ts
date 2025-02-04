import { Request, Response } from "express";
import { executeQuery } from "../config/database";

// Interface pour représenter les données de devis
interface QuoteData {
  clientId: number;
  totalAmount: number;
  dateIssued: string;
  status: string;
}

// Fonction de validation des données de devis
function validateQuoteData(quoteData: QuoteData): string[] {
  const errors: string[] = [];

  if (!quoteData.clientId || isNaN(quoteData.clientId))
    errors.push("L'ID du client est requis et doit être un nombre valide");
  if (!quoteData.totalAmount || isNaN(quoteData.totalAmount))
    errors.push("Le montant total est requis et doit être un nombre valide");
  if (!quoteData.dateIssued || !validateDate(quoteData.dateIssued))
    errors.push("Une date de création valide est requise");
  if (!quoteData.status) errors.push("Le statut est requis");

  return errors;
}

// Validation de la date
function validateDate(date: string): boolean {
  return !isNaN(Date.parse(date));
}

export const getAllQuotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const quotes = await executeQuery<QuoteData[]>("SELECT * FROM quotes");
    res.status(200).json(quotes);
  } catch (error) {
    console.error("Erreur lors de la récupération des devis :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la récupération des devis",
      });
  }
};

export const getQuoteById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const quoteId = parseInt(req.params.id);
    const quote = await executeQuery<QuoteData[]>(
      "SELECT * FROM quotes WHERE id = ?",
      [quoteId]
    );
    if (quote.length === 0) {
      res.status(404).json({ error: "Devis non trouvé" });
      return;
    }
    res.status(200).json(quote[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du devis :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la récupération du devis",
      });
  }
};

export const createQuote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const quoteData: QuoteData = req.body;
    const validationErrors = validateQuoteData(quoteData);

    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    await executeQuery(
      "INSERT INTO quotes (clientId, totalAmount, dateIssued, status) VALUES (?, ?, ?, ?)",
      [
        quoteData.clientId,
        quoteData.totalAmount,
        quoteData.dateIssued,
        quoteData.status,
      ]
    );

    res.status(201).json({ message: "Devis créé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la création du devis :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la création du devis",
      });
  }
};

export const updateQuote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const quoteId = parseInt(req.params.id);
    const quoteData: Partial<QuoteData> = req.body;
    if (Object.keys(quoteData).length === 0) {
      res
        .status(400)
        .json({ error: "Aucune donnée fournie pour la mise à jour" });
      return;
    }

    await executeQuery(
      "UPDATE quotes SET clientId = ?, totalAmount = ?, dateIssued = ?, status = ? WHERE id = ?",
      [
        quoteData.clientId,
        quoteData.totalAmount,
        quoteData.dateIssued,
        quoteData.status,
        quoteId,
      ]
    );

    res.status(200).json({ message: "Devis mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du devis :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la mise à jour du devis",
      });
  }
};

export const deleteQuote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const quoteId = parseInt(req.params.id);

    await executeQuery("DELETE FROM quotes WHERE id = ?", [quoteId]);
    res.status(200).json({ message: "Devis supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du devis :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la suppression du devis",
      });
  }
};
