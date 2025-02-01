import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Fonction améliorée pour mettre à jour les revenus
const updateRevenues = async (paymentDate: Date, amount: number) => {
  const year = paymentDate.getFullYear();
  const month = paymentDate.getMonth() + 1; // Les mois commencent à 0

  try {
    // Vérifier si une entrée existe déjà pour ce mois
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT * FROM revenues WHERE year = ? AND month = ?",
      [year, month]
    );

    if (rows.length > 0) {
      // Mise à jour du montant pour le mois existant
      await DatabaseServices.executeQuery(
        "UPDATE revenues SET amount = amount + ? WHERE year = ? AND month = ?",
        [amount, year, month]
      );

      console.log(`Revenus mis à jour pour ${month}/${year}: +${amount}€`);
    } else {
      // Création d'une nouvelle entrée pour le mois
      await DatabaseServices.executeQuery(
        "INSERT INTO revenues (year, month, amount) VALUES (?, ?, ?)",
        [year, month, amount]
      );

      console.log(
        `Nouvelle entrée de revenus créée pour ${month}/${year}: ${amount}€`
      );
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des revenus:", error);
    throw error;
  }
};

// Contrôleur de création de paiement amélioré
export const createPayment = async (req: Request, res: Response) => {
  const { invoiceId, amount, paymentDate, paymentMethod, status, reference } =
    req.body;

  try {
    // Vérifier si la facture existe
    const [invoiceRows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT * FROM invoices WHERE id = ?",
      [invoiceId]
    );

    if (invoiceRows.length === 0) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    // Créer le paiement
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      `INSERT INTO payments 
      (invoiceId, amount, paymentDate, paymentMethod, status, reference) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [invoiceId, amount, paymentDate, paymentMethod, status, reference]
    );

    // Mettre à jour les revenus
    await updateRevenues(new Date(paymentDate), amount);

    // Si le paiement est marqué comme "payé", mettre à jour le statut de la facture
    if (status === "payé") {
      await DatabaseServices.executeQuery(
        "UPDATE invoices SET status = 'paid' WHERE id = ?",
        [invoiceId]
      );
    }

    res.status(201).json({
      id: result.insertId,
      message: "Paiement créé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la création du paiement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Contrôleur de mise à jour de paiement amélioré
export const updatePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { invoiceId, amount, paymentDate, paymentMethod, status, reference } =
    req.body;

  try {
    // Récupérer l'ancien paiement
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT * FROM payments WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    const oldPayment = rows[0];
    const oldAmount = oldPayment.amount;
    const oldPaymentDate = new Date(oldPayment.paymentDate);

    // Mettre à jour le paiement
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      `UPDATE payments 
      SET invoiceId = ?, amount = ?, paymentDate = ?, paymentMethod = ?, status = ?, reference = ? 
      WHERE id = ?`,
      [invoiceId, amount, paymentDate, paymentMethod, status, reference, id]
    );

    // Mettre à jour les revenus si le montant ou la date a changé
    if (
      oldAmount !== amount ||
      oldPaymentDate.getMonth() !== new Date(paymentDate).getMonth() ||
      oldPaymentDate.getFullYear() !== new Date(paymentDate).getFullYear()
    ) {
      // Soustraire l'ancien montant des revenus
      await updateRevenues(oldPaymentDate, -oldAmount);
      // Ajouter le nouveau montant des revenus
      await updateRevenues(new Date(paymentDate), amount);
    }

    res.json({
      message: "Paiement mis à jour avec succès",
      changes: {
        oldAmount,
        newAmount: amount,
        oldDate: oldPaymentDate,
        newDate: paymentDate,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du paiement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Contrôleur de suppression de paiement amélioré
export const deletePayment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Récupérer le paiement avant de le supprimer
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT * FROM payments WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    const payment = rows[0];
    const amount = payment.amount;
    const paymentDate = new Date(payment.paymentDate);

    // Supprimer le paiement
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      "DELETE FROM payments WHERE id = ?",
      [id]
    );

    // Mettre à jour les revenus (soustraire le montant)
    await updateRevenues(paymentDate, -amount);

    res.json({
      message: "Paiement supprimé avec succès",
      removedAmount: amount,
      date: paymentDate,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du paiement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Contrôleur pour obtenir tous les paiements
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT p.*, i.invoiceNumber, i.clientId, c.name as clientName
       FROM payments p
       LEFT JOIN invoices i ON p.invoiceId = i.id
       LEFT JOIN clients c ON i.clientId = c.id
       ORDER BY p.paymentDate DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Contrôleur pour obtenir un paiement par ID
export const getPaymentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT p.*, i.invoiceNumber, i.clientId, c.name as clientName
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
