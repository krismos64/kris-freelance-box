import { Request, Response } from "express";
import { executeQuery } from "../config/database";

interface ClientData {
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  imageUrl?: string;
  comments?: string;
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

export const createClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clientData: ClientData = req.body;
    const validationErrors = validateClientData(clientData);

    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    await executeQuery(
      "INSERT INTO clients (name, email, phone, address, postalCode, city, imageUrl, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        clientData.name,
        clientData.email,
        clientData.phone,
        clientData.address,
        clientData.postalCode,
        clientData.city,
        clientData.imageUrl,
        clientData.comments,
      ]
    );

    res.status(201).json({ message: "Client created successfully" });
  } catch (error) {
    console.error("Error creating client:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the client" });
  }
};

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

    await executeQuery(
      "UPDATE clients SET name = ?, email = ?, phone = ?, address = ?, postalCode = ?, city = ?, imageUrl = ?, comments = ? WHERE id = ?",
      [
        clientData.name,
        clientData.email,
        clientData.phone,
        clientData.address,
        clientData.postalCode,
        clientData.city,
        clientData.imageUrl,
        clientData.comments,
        clientId,
      ]
    );

    res.status(200).json({ message: "Client updated successfully" });
  } catch (error) {
    console.error("Error updating client:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the client" });
  }
};

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
