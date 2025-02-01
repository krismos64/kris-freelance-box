import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const getAllQuotes = async (req: Request, res: Response) => {
  try {
    const quotes = await DatabaseServices.getAllQuotes();
    res.json(quotes);
  } catch (error) {
    console.error("Erreur lors de la récupération des devis:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getQuoteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT * FROM quotes WHERE id = ?",
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

export const createQuote = async (req: Request, res: Response) => {
  const { quoteNumber, creationDate, validUntil, clientId, total, items } = req.body;

  try {
    const result = await DatabaseServices.createQuote({
      quoteNumber,
      creationDate,
      validUntil,
      clientId,
      total,
      items,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de la création du devis:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateQuote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quoteNumber, creationDate, validUntil, clientId, total, items } = req.body;

  try {
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      `UPDATE quotes 
      SET quoteNumber = ?, creationDate = ?, validUntil = ?, clientId = ?, total = ? 
      WHERE id = ?`,
      [quoteNumber, creationDate, validUntil, clientId, total, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Devis non trouvé" });
    }

    res.json({ message: "Devis mis à jour avec succès" });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du devis ${id}`, error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteQuote = async (req: Request, res: Response) => {
  const { id } = req.params;

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
    console.error(`Erreur lors de la suppression du devis ${id}`, error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
