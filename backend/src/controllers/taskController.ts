import { Request, Response } from "express";
import pool from "../config/database";

// Obtenir toutes les tâches
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute(`SELECT * FROM tasks`);
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Créer une tâche
export const createTask = async (req: Request, res: Response) => {
  const { title, description, status, dueDate, clientId } = req.body;
  try {
    const [result] = await pool.execute(
      `INSERT INTO tasks (title, description, status, dueDate, clientId) 
      VALUES (?, ?, ?, ?, ?)`,
      [title, description, status, dueDate, clientId]
    );
    res.status(201).json({
      id: result.insertId,
      message: "Tâche créée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la création de la tâche:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mettre à jour une tâche
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;
  try {
    await pool.execute(
      `UPDATE tasks 
      SET title = ?, description = ?, status = ?, dueDate = ? 
      WHERE id = ?`,
      [title, description, status, dueDate, id]
    );
    res.json({ message: "Tâche mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
