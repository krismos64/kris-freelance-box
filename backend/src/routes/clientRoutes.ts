import express from "express";
import { check, validationResult } from "express-validator";

// Example route from clientRoutes.ts
const clientRouter = express.Router();

// Mock controller functions
const getClients = (req, res) => {
  res.send("Get all clients");
};

const getClientById = (req, res) => {
  res.send(`Get client with ID: ${req.params.id}`);
};

const createClient = (req, res) => {
  res.send("Client created");
};

// Updated routes with validations
clientRouter.get("/", getClients);

clientRouter.get(
  "/:id",
  [check("id").isUUID().withMessage("Invalid client ID format")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    getClientById(req, res);
  }
);

clientRouter.post(
  "/",
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Invalid email format"),
    check("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    createClient(req, res);
  }
);
