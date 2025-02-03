import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await DatabaseServices.getAllPayments();
    res.json(payments);
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getPaymentById = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT p.*, i.invoiceNumber, c.name as clientName
       FROM payments p
       LEFT JOIN invoices i ON p.invoiceId = i.id
       LEFT JOIN clients c ON i.clientId = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du paiement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createPayment = async (_req: Request, res: Response) => {
  try {
    const result = await DatabaseServices.createPayment(_req.body);

    // Mettre à jour le statut de la facture si nécessaire
    if (_req.body.status === "payé") {
      await DatabaseServices.executeQuery(
        "UPDATE invoices SET status = 'paid' WHERE id = ?",
        [_req.body.invoiceId]
      );
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de la création du paiement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updatePayment = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      `UPDATE payments SET 
        invoiceId = ?, 
        amount = ?, 
        paymentDate = ?, 
        paymentMethod = ?, 
        status = ?, 
        reference = ?
      WHERE id = ?`,
      [...Object.values(_req.body), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    res.json({ message: "Paiement mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du paiement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deletePayment = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      "DELETE FROM payments WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    res.json({ message: "Paiement supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du paiement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
