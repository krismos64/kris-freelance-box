import axios from "axios";
import {
  mockClients,
  mockInvoices,
  mockQuotes,
  mockTasks,
  mockDocuments,
  mockRevenues,
  mockPayments,
} from "../mocks/mockData";
import {
  Client,
  Invoice,
  Quote,
  Task,
  Document,
  Payment,
} from "../types/database";

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fonction générique de gestion des erreurs
const handleApiError = <T>(mockData: T[], errorMessage: string): T[] => {
  console.error(errorMessage);
  return mockData;
};

// Service pour les clients
export const ClientService = {
  async fetchAll(): Promise<Client[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients`);
      return response.data;
    } catch (error) {
      return handleApiError(
        mockClients,
        "Erreur lors de la récupération des clients"
      );
    }
  },

  async fetchById(id: number): Promise<Client | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du client ${id}`);
      return null;
    }
  },

  async create(clientData: Partial<Client>): Promise<Client | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/clients`, clientData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du client", error);
      return null;
    }
  },

  async update(
    id: number,
    clientData: Partial<Client>
  ): Promise<Client | null> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/clients/${id}`,
        clientData
      );
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du client ${id}`, error);
      return null;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/clients/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du client ${id}`, error);
      return false;
    }
  },
};

// Service pour les factures
export const InvoiceService = {
  async fetchAll(): Promise<Invoice[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/invoices`);
      return response.data;
    } catch (error) {
      return handleApiError(
        mockInvoices,
        "Erreur lors de la récupération des factures"
      );
    }
  },

  async fetchByClientId(clientId: number): Promise<Invoice[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/invoices/client/${clientId}`
      );
      return response.data;
    } catch (error) {
      return mockInvoices.filter((inv) => inv.clientId === clientId);
    }
  },

  async create(invoiceData: Partial<Invoice>): Promise<Invoice | null> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/invoices`,
        invoiceData
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la facture", error);
      return null;
    }
  },
};

// Service pour les devis
export const QuoteService = {
  async fetchAll(): Promise<Quote[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/quotes`);
      return response.data;
    } catch (error) {
      return handleApiError(
        mockQuotes,
        "Erreur lors de la récupération des devis"
      );
    }
  },

  async create(quoteData: Partial<Quote>): Promise<Quote | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/quotes`, quoteData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du devis", error);
      return null;
    }
  },
};

// Service pour les tâches
export const TaskService = {
  async fetchAll(): Promise<Task[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      return response.data;
    } catch (error) {
      return handleApiError(
        mockTasks,
        "Erreur lors de la récupération des tâches"
      );
    }
  },

  async create(taskData: Partial<Task>): Promise<Task | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la tâche", error);
      return null;
    }
  },

  async update(id: number, taskData: Partial<Task>): Promise<Task | null> {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la tâche ${id}`, error);
      return null;
    }
  },
};

// Service pour les documents
export const DocumentService = {
  async fetchAll(): Promise<Document[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents`);
      return response.data;
    } catch (error) {
      return handleApiError(
        mockDocuments,
        "Erreur lors de la récupération des documents"
      );
    }
  },

  async uploadDocument(
    file: File,
    folderId?: number
  ): Promise<Document | null> {
    try {
      const formData = new FormData();
      formData.append("document", file);
      if (folderId) formData.append("folderId", folderId.toString());

      const response = await axios.post(
        `${API_BASE_URL}/documents/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors du téléchargement du document", error);
      return null;
    }
  },
};

// Service pour les paiements
export const PaymentService = {
  async fetchAll(): Promise<Payment[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments`);
      return response.data;
    } catch (error) {
      return handleApiError(
        mockPayments,
        "Erreur lors de la récupération des paiements"
      );
    }
  },

  async create(paymentData: Partial<Payment>): Promise<Payment | null> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments`,
        paymentData
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du paiement", error);
      return null;
    }
  },
};

// Services de récupération rapide (pour compatibilité avec les anciens codes)
export const fetchClients = () => ClientService.fetchAll();
export const fetchInvoices = () => InvoiceService.fetchAll();
export const fetchQuotes = () => QuoteService.fetchAll();
export const fetchTasks = () => TaskService.fetchAll();
export const fetchDocuments = () => DocumentService.fetchAll();
export const fetchRevenues = () => Promise.resolve(mockRevenues);
export const fetchPayments = () => PaymentService.fetchAll();
