import { Request, Response } from "express";
import { executeQuery } from "../config/database";

// Interface pour représenter les données de facture
interface InvoiceData {
  clientId: number;
  date: string;
  totalAmount: number;
  status: string;
}

// Fonction de validation des données de facture
function validateInvoiceData(invoiceData: InvoiceData): string[] {
  const errors: string[] = [];

  if (!invoiceData.clientId || isNaN(invoiceData.clientId))
    errors.push("L'ID du client est requis et doit être un nombre valide");
  if (!invoiceData.date || !validateDate(invoiceData.date))
    errors.push("Une date valide est requise");
  if (!invoiceData.totalAmount || isNaN(invoiceData.totalAmount))
    errors.push("Le montant total est requis et doit être un nombre valide");
  if (!invoiceData.status) errors.push("Le statut de la facture est requis");

  return errors;
}

// Validation de la date
function validateDate(date: string): boolean {
  return !isNaN(Date.parse(date));
}

export const getAllInvoices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoices = await executeQuery<InvoiceData[]>(
      "SELECT * FROM invoices"
    );
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Erreur lors de la récupération des factures :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la récupération des factures",
      });
  }
};

export const getInvoiceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoiceId = parseInt(req.params.id);
    const invoice = await executeQuery<InvoiceData[]>(
      "SELECT * FROM invoices WHERE id = ?",
      [invoiceId]
    );
    if (invoice.length === 0) {
      res.status(404).json({ error: "Facture non trouvée" });
      return;
    }
    res.status(200).json(invoice[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération de la facture :", error);
    res
      .status(500)
      .json({
        error:
          "Une erreur s'est produite lors de la récupération de la facture",
      });
  }
};

export const createInvoice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoiceData: InvoiceData = req.body;
    const validationErrors = validateInvoiceData(invoiceData);

    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    await executeQuery(
      "INSERT INTO invoices (clientId, date, totalAmount, status) VALUES (?, ?, ?, ?)",
      [
        invoiceData.clientId,
        invoiceData.date,
        invoiceData.totalAmount,
        invoiceData.status,
      ]
    );

    res.status(201).json({ message: "Facture créée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la création de la facture :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la création de la facture",
      });
  }
};

export const updateInvoice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoiceId = parseInt(req.params.id);
    const invoiceData: Partial<InvoiceData> = req.body;
    if (Object.keys(invoiceData).length === 0) {
      res
        .status(400)
        .json({ error: "Aucune donnée fournie pour la mise à jour" });
      return;
    }

    await executeQuery(
      "UPDATE invoices SET clientId = ?, date = ?, totalAmount = ?, status = ? WHERE id = ?",
      [
        invoiceData.clientId,
        invoiceData.date,
        invoiceData.totalAmount,
        invoiceData.status,
        invoiceId,
      ]
    );

    res.status(200).json({ message: "Facture mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la facture :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la mise à jour de la facture",
      });
  }
};

export const deleteInvoice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoiceId = parseInt(req.params.id);

    await executeQuery("DELETE FROM invoices WHERE id = ?", [invoiceId]);
    res.status(200).json({ message: "Facture supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la facture :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la suppression de la facture",
      });
  }
};
