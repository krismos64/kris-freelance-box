import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const getAllInvoices = async (_req: Request, res: Response) => {
  try {
    const invoices = await DatabaseServices.getAllInvoices();
    res.json(invoices);
  } catch (error) {
    console.error("Erreur lors de la récupération des factures:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getInvoiceById = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const invoice = await DatabaseServices.getInvoiceById(Number(id));
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }
    res.json(invoice);
  } catch (error) {
    console.error("Erreur lors de la récupération de la facture:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getInvoicesByClientId = async (_req: Request, res: Response) => {
  const { clientId } = _req.params;
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
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

export const createInvoice = async (_req: Request, res: Response) => {
  try {
    const result = await DatabaseServices.createInvoice(_req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de la création de la facture:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateInvoice = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      `UPDATE invoices SET 
        invoiceNumber = ?, 
        creationDate = ?, 
        dueDate = ?, 
        clientId = ?, 
        total = ?, 
        status = ?
      WHERE id = ?`,
      [...Object.values(_req.body), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    res.json({ message: "Facture mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la facture:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteInvoice = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      "DELETE FROM invoices WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    res.json({ message: "Facture supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la facture:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
