import { Router, Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController";

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

// Obtenir tous les paiements
router.get("/", getAllPayments);

// Obtenir un paiement par ID avec validation de l'ID
router.get(
  "/:id",
  [
    check("id", "L'ID du paiement doit être un entier valide").isInt(),
    handleValidationErrors,
  ],
  getPaymentById
);

// Créer un nouveau paiement avec validation des données d'entrée
router.post(
  "/",
  [
    check(
      "invoiceId",
      "L'ID de la facture est requis et doit être un entier"
    ).isInt(),
    check("amount", "Le montant est requis et doit être un nombre").isFloat(),
    check(
      "paymentDate",
      "La date de paiement est requise et doit être une date valide"
    ).isISO8601(),
    handleValidationErrors,
  ],
  createPayment
);

// Mettre à jour un paiement existant avec validation
router.put(
  "/:id",
  [
    check("id", "L'ID du paiement doit être un entier valide").isInt(),
    check("invoiceId", "L'ID de la facture doit être un entier")
      .optional()
      .isInt(),
    check("amount", "Le montant doit être un nombre").optional().isFloat(),
    check("paymentDate", "La date de paiement doit être une date valide")
      .optional()
      .isISO8601(),
    handleValidationErrors,
  ],
  updatePayment
);

// Supprimer un paiement avec validation de l'ID
router.delete(
  "/:id",
  [
    check("id", "L'ID du paiement doit être un entier valide").isInt(),
    handleValidationErrors,
  ],
  deletePayment
);

export default router;
