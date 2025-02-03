import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const getAllTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await DatabaseServices.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getTaskById = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération de la tâche:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createTask = async (_req: Request, res: Response) => {
  try {
    const result = await DatabaseServices.createTask(_req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de la création de la tâche:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateTask = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const success = await DatabaseServices.updateTask(Number(id), _req.body);
    if (!success) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }
    res.json({ message: "Tâche mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteTask = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      "DELETE FROM tasks WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    res.json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
