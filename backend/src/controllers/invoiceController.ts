import { Request, Response } from "express";
import pool from "../config/database";

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute(`
      SELECT i.*, c.name as clientName 
      FROM invoices i
      LEFT JOIN clients c ON i.clientId = c.id
    `);
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des factures:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getInvoicesByClientId = async (req: Request, res: Response) => {
  const { clientId } = req.params;
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM invoices WHERE clientId = ?",
      [clientId]
    );
    res.json(rows);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des factures du client:",
      error
    );
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  const { invoiceNumber, creationDate, dueDate, clientId, total, items } =
    req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Créer la facture
    const [invoiceResult] = await connection.execute(
      `INSERT INTO invoices 
      (invoiceNumber, creationDate, dueDate, clientId, total) 
      VALUES (?, ?, ?, ?, ?)`,
      [invoiceNumber, creationDate, dueDate, clientId, total]
    );

    const invoiceId = invoiceResult.insertId;

    // Insérer les lignes de facture
    if (items && items.length > 0) {
      const itemQueries = items.map(() => "(?, ?, ?, ?)").join(", ");

      const itemValues = items.flatMap((item) => [
        invoiceId,
        item.description,
        item.quantity,
        item.unitPrice,
      ]);

      await connection.execute(
        `INSERT INTO invoice_items 
        (invoiceId, description, quantity, unitPrice) 
        VALUES ${itemQueries}`,
        itemValues
      );
    }

    await connection.commit();

    res.status(201).json({
      id: invoiceId,
      message: "Facture créée avec succès",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la création de la facture:", error);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    connection.release();
  }
};
