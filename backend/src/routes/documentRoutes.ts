import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import * as documentController from "../controllers/documentController";

const router = Router();

// Middleware de validation des résultats
const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes
router.get("/", documentController.getAllDocuments);

router.get(
  "/:id",
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("L'ID doit être un entier positif"),
  ],
  validateRequest,
  documentController.getDocumentById
);

router.post(
  "/",
  [
    body("title")
      .isString()
      .notEmpty()
      .withMessage("Le titre du document est obligatoire"),
    body("type")
      .isString()
      .notEmpty()
      .withMessage("Le type de document est obligatoire"),
    body("content")
      .optional()
      .isString()
      .withMessage("Le contenu doit être une chaîne de caractères"),
    body("folderId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("L'ID du dossier doit être un entier positif si fourni"),
  ],
  validateRequest,
  documentController.createDocument
);

router.put(
  "/:id",
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("L'ID doit être un entier positif"),
    body("title")
      .optional()
      .isString()
      .withMessage("Le titre doit être une chaîne de caractères"),
    body("type")
      .optional()
      .isString()
      .withMessage("Le type doit être une chaîne de caractères"),
    body("content")
      .optional()
      .isString()
      .withMessage("Le contenu doit être une chaîne de caractères"),
    body("folderId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("L'ID du dossier doit être un entier positif si fourni"),
  ],
  validateRequest,
  documentController.updateDocument
);

router.delete(
  "/:id",
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("L'ID doit être un entier positif"),
  ],
  validateRequest,
  documentController.deleteDocument
);

export default router;
