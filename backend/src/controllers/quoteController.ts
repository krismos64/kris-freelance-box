import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const getAllQuotes = async (_req: Request, res: Response) => {
  try {
    const quotes = await DatabaseServices.getAllQuotes();
    res.json(quotes);
  } catch (error) {
    console.error("Erreur lors de la récupération des devis:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getQuoteById = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT q.*, c.name as clientName 
       FROM quotes q 
       LEFT JOIN clients c ON q.clientId = c.id 
       WHERE q.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Devis non trouvé" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du devis:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createQuote = async (_req: Request, res: Response) => {
  try {
    const result = await DatabaseServices.createQuote(_req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de la création du devis:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateQuote = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      `UPDATE quotes SET 
        quoteNumber = ?, 
        creationDate = ?, 
        validUntil = ?, 
        clientId = ?, 
        total = ?, 
        status = ?
      WHERE id = ?`,
      [...Object.values(_req.body), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Devis non trouvé" });
    }

    res.json({ message: "Devis mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du devis:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteQuote = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      "DELETE FROM quotes WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Devis non trouvé" });
    }

    res.json({ message: "Devis supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du devis:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
