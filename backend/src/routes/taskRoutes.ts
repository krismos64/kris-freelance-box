import { Router, Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const router = Router();

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtenir toutes les tâches
router.get("/", getAllTasks);

// Obtenir une tâche par ID avec validation de l'ID
router.get(
  "/:id",
  [
    check("id", "L'ID de la tâche doit être un entier valide").isInt(),
    handleValidationErrors,
  ],
  getTaskById
);

// Créer une nouvelle tâche avec validation des données d'entrée
router.post(
  "/",
  [
    check(
      "title",
      "Le titre de la tâche est requis et doit être une chaîne de caractères"
    ).isString(),
    check(
      "description",
      "La description de la tâche doit être une chaîne de caractères"
    )
      .optional()
      .isString(),
    check("dueDate", "La date d'échéance doit être une date valide")
      .optional()
      .isISO8601(),
    check("status", "Le statut doit être complété ou en attente")
      .optional()
      .isIn(["completed", "pending"]),
    check("clientId", "Le clientId doit être un entier valide")
      .optional()
      .isInt(),
    handleValidationErrors,
  ],
  createTask
);

// Mettre à jour une tâche existante avec validation
router.put(
  "/:id",
  [
    check("id", "L'ID de la tâche doit être un entier valide").isInt(),
    check("title", "Le titre de la tâche doit être une chaîne de caractères")
      .optional()
      .isString(),
    check(
      "description",
      "La description de la tâche doit être une chaîne de caractères"
    )
      .optional()
      .isString(),
    check("dueDate", "La date d'échéance doit être une date valide")
      .optional()
      .isISO8601(),
    check("status", "Le statut doit être complété ou en attente")
      .optional()
      .isIn(["completed", "pending"]),
    check("clientId", "Le clientId doit être un entier valide")
      .optional()
      .isInt(),
    handleValidationErrors,
  ],
  updateTask
);

// Supprimer une tâche avec validation de l'ID
router.delete(
  "/:id",
  [
    check("id", "L'ID de la tâche doit être un entier valide").isInt(),
    handleValidationErrors,
  ],
  deleteTask
);

export default router;
