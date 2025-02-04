import { Request, Response } from "express";
import { executeQuery } from "../config/database";

// Interface pour représenter les données de paiement
interface PaymentData {
  invoiceId: number;
  amount: number;
  date: string;
  method: string;
}

// Fonction de validation des données de paiement
function validatePaymentData(paymentData: PaymentData): string[] {
  const errors: string[] = [];

  if (!paymentData.invoiceId || isNaN(paymentData.invoiceId))
    errors.push("L'ID de la facture est requis et doit être un nombre valide");
  if (!paymentData.amount || isNaN(paymentData.amount))
    errors.push("Le montant est requis et doit être un nombre valide");
  if (!paymentData.date || !validateDate(paymentData.date))
    errors.push("Une date valide est requise");
  if (!paymentData.method) errors.push("La méthode de paiement est requise");

  return errors;
}

// Validation de la date
function validateDate(date: string): boolean {
  return !isNaN(Date.parse(date));
}

export const getAllPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payments = await executeQuery<PaymentData[]>(
      "SELECT * FROM payments"
    );
    res.status(200).json(payments);
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements :", error);
    res
      .status(500)
      .json({
        error:
          "Une erreur s'est produite lors de la récupération des paiements",
      });
  }
};

export const getPaymentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const paymentId = parseInt(req.params.id);
    const payment = await executeQuery<PaymentData[]>(
      "SELECT * FROM payments WHERE id = ?",
      [paymentId]
    );
    if (payment.length === 0) {
      res.status(404).json({ error: "Paiement non trouvé" });
      return;
    }
    res.status(200).json(payment[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du paiement :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la récupération du paiement",
      });
  }
};

export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const paymentData: PaymentData = req.body;
    const validationErrors = validatePaymentData(paymentData);

    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    await executeQuery(
      "INSERT INTO payments (invoiceId, amount, date, method) VALUES (?, ?, ?, ?)",
      [
        paymentData.invoiceId,
        paymentData.amount,
        paymentData.date,
        paymentData.method,
      ]
    );

    res.status(201).json({ message: "Paiement créé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la création du paiement :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la création du paiement",
      });
  }
};

export const updatePayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const paymentId = parseInt(req.params.id);
    const paymentData: Partial<PaymentData> = req.body;
    if (Object.keys(paymentData).length === 0) {
      res
        .status(400)
        .json({ error: "Aucune donnée fournie pour la mise à jour" });
      return;
    }

    await executeQuery(
      "UPDATE payments SET invoiceId = ?, amount = ?, date = ?, method = ? WHERE id = ?",
      [
        paymentData.invoiceId,
        paymentData.amount,
        paymentData.date,
        paymentData.method,
        paymentId,
      ]
    );

    res.status(200).json({ message: "Paiement mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du paiement :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la mise à jour du paiement",
      });
  }
};

export const deletePayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const paymentId = parseInt(req.params.id);

    await executeQuery("DELETE FROM payments WHERE id = ?", [paymentId]);
    res.status(200).json({ message: "Paiement supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du paiement :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la suppression du paiement",
      });
  }
};
