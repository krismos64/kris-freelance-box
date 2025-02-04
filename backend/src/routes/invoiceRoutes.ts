import { Router, Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoiceController";

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

// Obtenir toutes les factures
router.get("/", getAllInvoices);

// Obtenir une facture par ID avec validation de l'ID
router.get(
  "/:id",
  [
    check("id", "L'ID de la facture doit être un entier valide").isInt(),
    handleValidationErrors,
  ],
  getInvoiceById
);

// Créer une nouvelle facture avec validation des données d'entrée
router.post(
  "/",
  [
    check("clientId", "Le clientId est requis et doit être un entier").isInt(),
    check("amount", "Le montant est requis et doit être un nombre").isFloat(),
    check(
      "dueDate",
      "La date d'échéance est requise et doit être une date valide"
    ).isISO8601(),
    handleValidationErrors,
  ],
  createInvoice
);

// Mettre à jour une facture existante avec validation
router.put(
  "/:id",
  [
    check("id", "L'ID de la facture doit être un entier valide").isInt(),
    check("clientId", "Le clientId doit être un entier").optional().isInt(),
    check("amount", "Le montant doit être un nombre").optional().isFloat(),
    check("dueDate", "La date d'échéance doit être une date valide")
      .optional()
      .isISO8601(),
    handleValidationErrors,
  ],
  updateInvoice
);

// Supprimer une facture avec validation de l'ID
router.delete(
  "/:id",
  [
    check("id", "L'ID de la facture doit être un entier valide").isInt(),
    handleValidationErrors,
  ],
  deleteInvoice
);

export default router;
