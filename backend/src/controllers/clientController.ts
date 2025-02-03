import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const getAllClients = async (_req: Request, res: Response) => {
  try {
    const clients = await DatabaseServices.getAllClients();
    res.json(clients);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getClientById = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT * FROM clients WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Client non trouvé" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du client:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createClient = async (_req: Request, res: Response) => {
  try {
    const result = await DatabaseServices.createClient(_req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de la création du client:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateClient = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      `UPDATE clients 
      SET name = ?, email = ?, phone = ?, address = ?, 
          postalCode = ?, city = ?, imageUrl = ?, comments = ? 
      WHERE id = ?`,
      [...Object.values(_req.body), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    res.json({ message: "Client mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteClient = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      "DELETE FROM clients WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    res.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du client:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
