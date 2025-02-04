import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import * as clientController from "../controllers/clientController";

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
router.get("/", clientController.getAllClients);

router.get(
  "/:id",
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("L'ID doit être un entier positif"),
  ],
  validateRequest,
  clientController.getClientById
);

router.post(
  "/",
  [
    body("name")
      .isString()
      .notEmpty()
      .withMessage("Le nom du client est obligatoire"),
    body("email").isEmail().withMessage("Un email valide est obligatoire"),
    body("phone")
      .optional()
      .isString()
      .withMessage("Le numéro de téléphone doit être une chaîne de caractères"),
  ],
  validateRequest,
  clientController.createClient
);

router.put(
  "/:id",
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("L'ID doit être un entier positif"),
    body("name")
      .optional()
      .isString()
      .withMessage("Le nom doit être une chaîne de caractères"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Un email valide est requis si fourni"),
    body("phone")
      .optional()
      .isString()
      .withMessage("Le numéro de téléphone doit être une chaîne de caractères"),
  ],
  validateRequest,
  clientController.updateClient
);

router.delete(
  "/:id",
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("L'ID doit être un entier positif"),
  ],
  validateRequest,
  clientController.deleteClient
);

export default router;
