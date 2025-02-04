import { Router, Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import {
  getAllRevenues,
  getRevenueById,
  createRevenue,
  updateRevenue,
  deleteRevenue,
} from "../controllers/revenueController";

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

// Obtenir toutes les entrées de revenus
router.get("/", getAllRevenues);

// Obtenir une entrée de revenu par ID avec validation de l'ID
router.get(
  "/:id",
  [
    check("id", "L'ID du revenu doit être un entier valide").isInt(),
    handleValidationErrors,
  ],
  getRevenueById
);

// Créer une nouvelle entrée de revenu avec validation des données d'entrée
router.post(
  "/",
  [
    check(
      "source",
      "La source de revenu est requise et doit être une chaîne de caractères"
    ).isString(),
    check("amount", "Le montant est requis et doit être un nombre").isFloat(),
    check(
      "dateReceived",
      "La date de réception est requise et doit être une date valide"
    ).isISO8601(),
    handleValidationErrors,
  ],
  createRevenue
);

// Mettre à jour une entrée de revenu existante avec validation
router.put(
  "/:id",
  [
    check("id", "L'ID du revenu doit être un entier valide").isInt(),
    check("source", "La source doit être une chaîne de caractères")
      .optional()
      .isString(),
    check("amount", "Le montant doit être un nombre").optional().isFloat(),
    check("dateReceived", "La date de réception doit être une date valide")
      .optional()
      .isISO8601(),
    handleValidationErrors,
  ],
  updateRevenue
);

// Supprimer une entrée de revenu avec validation de l'ID
router.delete(
  "/:id",
  [
    check("id", "L'ID du revenu doit être un entier valide").isInt(),
    handleValidationErrors,
  ],
  deleteRevenue
);

export default router;
