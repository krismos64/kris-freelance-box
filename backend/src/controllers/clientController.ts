import { Request, Response } from "express";
import pool from "../config/database";

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM clients");
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute("SELECT * FROM clients WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Client non trouvé" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du client:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createClient = async (req: Request, res: Response) => {
  const { name, email, phone, address, postalCode, city, imageUrl, comments } =
    req.body;

  try {
    const [result] = await pool.execute(
      `INSERT INTO clients 
      (name, email, phone, address, postalCode, city, imageUrl, comments, creationDate) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone,
        address,
        postalCode,
        city,
        imageUrl,
        comments,
        new Date(),
      ]
    );
    res.status(201).json({
      id: result.insertId,
      message: "Client créé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la création du client:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, address, postalCode, city, imageUrl, comments } =
    req.body;

  try {
    const [result] = await pool.execute(
      `UPDATE clients 
      SET name = ?, email = ?, phone = ?, address = ?, 
      postalCode = ?, city = ?, imageUrl = ?, comments = ? 
      WHERE id = ?`,
      [name, email, phone, address, postalCode, city, imageUrl, comments, id]
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

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute("DELETE FROM clients WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    res.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du client:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
