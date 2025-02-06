import { Request, Response } from "express";
import { executeQuery } from "../config/database";
import multer from "multer";
import path from "path";
import { format } from "date-fns";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

interface ClientData {
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  imageUrl?: string;
  comments?: string;
  creationDate?: string;
}

function validateClientData(clientData: ClientData): string[] {
  const errors: string[] = [];

  if (!clientData.name) errors.push("Name is required");
  if (!clientData.email || !validateEmail(clientData.email))
    errors.push("Valid email is required");
  if (!clientData.phone) errors.push("Phone number is required");

  return errors;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Récupérer tous les clients
export const getAllClients = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clients = await executeQuery<ClientData[]>("SELECT * FROM clients");
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "An error occurred while fetching clients" });
  }
};

// Récupérer un client par son ID
export const getClientById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clientId = parseInt(req.params.id);
    if (isNaN(clientId)) {
      res.status(400).json({ error: "Invalid client ID" });
      return;
    }

    const client = await executeQuery<ClientData[]>(
      "SELECT * FROM clients WHERE id = ?",
      [clientId]
    );
    if (client.length === 0) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    res.status(200).json(client[0]);
  } catch (error) {
    console.error("Error fetching client:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the client" });
  }
};

// Créer un nouveau client
export const createClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clientData: ClientData = req.body;

    // Gestion du fichier d'image
    if (req.file) {
      clientData.imageUrl = `/uploads/${req.file.filename}`;
    }
    console.log("Chemin de l'image enregistrée :", clientData.imageUrl);

    // Validation des données
    const validationErrors = validateClientData(clientData);
    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    // Ajout de la date de création
    clientData.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    // Préparation des données pour éviter les valeurs undefined
    const preparedData = [
      clientData.name || null,
      clientData.email || null,
      clientData.phone || null,
      clientData.address || null,
      clientData.postalCode || null,
      clientData.city || null,
      clientData.imageUrl || null,
      clientData.comments || null,
      clientData.creationDate || null,
    ];

    await executeQuery(
      "INSERT INTO clients (name, email, phone, address, postalCode, city, imageUrl, comments, creationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      preparedData
    );

    res.status(201).json({ message: "Client created successfully" });
  } catch (error) {
    console.error("Error creating client:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the client" });
  }
};

// Mettre à jour un client
export const updateClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clientId = parseInt(req.params.id);
    if (isNaN(clientId)) {
      res.status(400).json({ error: "Invalid client ID" });
      return;
    }

    const clientData: Partial<ClientData> = req.body;

    if (Object.keys(clientData).length === 0) {
      res.status(400).json({ error: "No data provided to update" });
      return;
    }

    // Gestion du fichier d'image
    if (req.file) {
      clientData.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Préparation des données pour éviter les valeurs undefined
    const preparedData = [
      clientData.name || null,
      clientData.email || null,
      clientData.phone || null,
      clientData.address || null,
      clientData.postalCode || null,
      clientData.city || null,
      clientData.imageUrl || null,
      clientData.comments || null,
      clientId,
    ];

    await executeQuery(
      "UPDATE clients SET name = ?, email = ?, phone = ?, address = ?, postalCode = ?, city = ?, imageUrl = ?, comments = ? WHERE id = ?",
      preparedData
    );

    res.status(200).json({ message: "Client updated successfully" });
  } catch (error) {
    console.error("Error updating client:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the client" });
  }
};

// Supprimer un client
export const deleteClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clientId = parseInt(req.params.id);
    if (isNaN(clientId)) {
      res.status(400).json({ error: "Invalid client ID" });
      return;
    }

    await executeQuery("DELETE FROM clients WHERE id = ?", [clientId]);
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the client" });
  }
};
