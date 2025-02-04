import { Router, Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import {
  getAllQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
} from "../controllers/quoteController";

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

// Obtenir tous les devis
router.get("/", getAllQuotes);

// Obtenir un devis par ID avec validation de l'ID
router.get(
  "/:id",
  [
    check("id", "L'ID du devis doit être un entier valide").isInt(),
    handleValidationErrors,
  ],
  getQuoteById
);

// Créer un nouveau devis avec validation des données d'entrée
router.post(
  "/",
  [
    check(
      "clientId",
      "L'ID du client est requis et doit être un entier"
    ).isInt(),
    check(
      "totalAmount",
      "Le montant total est requis et doit être un nombre"
    ).isFloat(),
    check(
      "quoteDate",
      "La date du devis est requise et doit être une date valide"
    ).isISO8601(),
    handleValidationErrors,
  ],
  createQuote
);

// Mettre à jour un devis existant avec validation
router.put(
  "/:id",
  [
    check("id", "L'ID du devis doit être un entier valide").isInt(),
    check("clientId", "L'ID du client doit être un entier").optional().isInt(),
    check("totalAmount", "Le montant total doit être un nombre")
      .optional()
      .isFloat(),
    check("quoteDate", "La date du devis doit être une date valide")
      .optional()
      .isISO8601(),
    handleValidationErrors,
  ],
  updateQuote
);

// Supprimer un devis avec validation de l'ID
router.delete(
  "/:id",
  [
    check("id", "L'ID du devis doit être un entier valide").isInt(),
    handleValidationErrors,
  ],
  deleteQuote
);

export default router;
