import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Fonction pour mettre à jour les revenus
const updateRevenues = async (paymentDate: Date, amount: number) => {
  const month = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1);
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT * FROM revenues WHERE month = ?",
      [month]
    );

    if (rows.length > 0) {
      // Si le mois existe, mettre à jour le montant
      await DatabaseServices.executeQuery<ResultSetHeader>(
        "UPDATE revenues SET amount = amount + ? WHERE month = ?",
        [amount, month]
      );
    } else {
      // Si le mois n'existe pas, créer une nouvelle entrée
      await DatabaseServices.executeQuery<ResultSetHeader>(
        "INSERT INTO revenues (month, amount) VALUES (?, ?)",
        [month, amount]
      );
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des revenus:", error);
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await DatabaseServices.getAllPayments();
    res.json(payments);
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT * FROM payments WHERE id = ?",
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

export const createPayment = async (req: Request, res: Response) => {
  const { invoiceId, amount, paymentDate, paymentMethod, status, reference } =
    req.body;

  try {
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      `INSERT INTO payments 
      (invoiceId, amount, paymentDate, paymentMethod, status, reference) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [invoiceId, amount, paymentDate, paymentMethod, status, reference]
    );

    // Mettre à jour les revenus
    await updateRevenues(new Date(paymentDate), amount);

    res.status(201).json({
      id: result.insertId,
      message: "Paiement créé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la création du paiement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { invoiceId, amount, paymentDate, paymentMethod, status, reference } =
    req.body;

  try {
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

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    // Mettre à jour les revenus si le montant ou la date de paiement a changé
    if (
      oldAmount !== amount ||
      oldPaymentDate.getMonth() !== new Date(paymentDate).getMonth()
    ) {
      // Soustraire l'ancien montant des revenus
      await updateRevenues(oldPaymentDate, -oldAmount);
      // Ajouter le nouveau montant des revenus
      await updateRevenues(new Date(paymentDate), amount);
    }

    res.json({ message: "Paiement mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du paiement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
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

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    // Mettre à jour les revenus
    await updateRevenues(paymentDate, -amount);

    res.json({ message: "Paiement supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du paiement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
