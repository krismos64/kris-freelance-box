import { Request, Response } from "express";
import pool from "../config/database";
import { DatabaseServices } from "../config/database";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await DatabaseServices.getAllInvoices();
    res.json(invoices);
  } catch (error) {
    console.error("Erreur lors de la récupération des factures:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getInvoicesByClientId = async (req: Request, res: Response) => {
  const { clientId } = req.params;
  try {
    const invoices = await DatabaseServices.getInvoicesByClientId(
      Number(clientId)
    );
    res.json(invoices);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des factures du client:",
      error
    );
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  const { invoiceNumber, creationDate, dueDate, clientId, total, items } =
    req.body;

  try {
    const result = await DatabaseServices.createInvoice({
      invoiceNumber,
      creationDate,
      dueDate,
      clientId,
      total,
      items,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de la création de la facture:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
