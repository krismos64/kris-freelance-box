import { Request, Response } from "express";
import { executeQuery } from "../config/database";

// Interface pour représenter les données de tâches
interface TaskData {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  clientId?: number;
  dueDate?: string;
}

// Fonction de validation des données de tâches
function validateTaskData(taskData: TaskData): string[] {
  const errors: string[] = [];

  if (!taskData.title || taskData.title.trim().length === 0)
    errors.push("Le titre est requis et ne peut pas être vide");
  if (
    taskData.status &&
    !["pending", "in-progress", "completed"].includes(taskData.status)
  )
    errors.push("Le statut est invalide");
  if (taskData.dueDate && !validateDate(taskData.dueDate))
    errors.push("La date d'échéance doit être valide");

  return errors;
}

// Validation de la date
function validateDate(date: string): boolean {
  return !isNaN(Date.parse(date));
}

export const getAllTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tasks = await executeQuery<TaskData[]>("SELECT * FROM tasks");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la récupération des tâches",
      });
  }
};

export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id);
    const task = await executeQuery<TaskData[]>(
      "SELECT * FROM tasks WHERE id = ?",
      [taskId]
    );
    if (task.length === 0) {
      res.status(404).json({ error: "Tâche non trouvée" });
      return;
    }
    res.status(200).json(task[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération de la tâche :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la récupération de la tâche",
      });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskData: TaskData = req.body;
    const validationErrors = validateTaskData(taskData);

    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    await executeQuery(
      "INSERT INTO tasks (title, description, status, clientId, dueDate) VALUES (?, ?, ?, ?, ?)",
      [
        taskData.title,
        taskData.description,
        taskData.status,
        taskData.clientId,
        taskData.dueDate,
      ]
    );

    res.status(201).json({ message: "Tâche créée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la création de la tâche :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la création de la tâche",
      });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id);
    const taskData: Partial<TaskData> = req.body;
    if (Object.keys(taskData).length === 0) {
      res
        .status(400)
        .json({ error: "Aucune donnée fournie pour la mise à jour" });
      return;
    }

    await executeQuery(
      "UPDATE tasks SET title = ?, description = ?, status = ?, clientId = ?, dueDate = ? WHERE id = ?",
      [
        taskData.title,
        taskData.description,
        taskData.status,
        taskData.clientId,
        taskData.dueDate,
        taskId,
      ]
    );

    res.status(200).json({ message: "Tâche mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la mise à jour de la tâche",
      });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id);

    await executeQuery("DELETE FROM tasks WHERE id = ?", [taskId]);
    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche :", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la suppression de la tâche",
      });
  }
};
