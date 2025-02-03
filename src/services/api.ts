import axios from "axios";
import {
  Client,
  Invoice,
  Quote,
  Task,
  Document,
  Company,
  Revenue,
  Payment,
} from "../types/database";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ClientService = {
  async fetchAll(): Promise<Client[]> {
    const response = await axios.get(`${API_BASE_URL}/clients`);
    return response.data;
  },

  async fetchById(id: number): Promise<Client | null> {
    const response = await axios.get(`${API_BASE_URL}/clients/${id}`);
    return response.data;
  },

  async create(clientData: Partial<Client>): Promise<Client | null> {
    const response = await axios.post(`${API_BASE_URL}/clients`, clientData);
    return response.data;
  },

  async update(
    id: number,
    clientData: Partial<Client>
  ): Promise<Client | null> {
    const response = await axios.put(
      `${API_BASE_URL}/clients/${id}`,
      clientData
    );
    return response.data;
  },

  async delete(id: number): Promise<boolean> {
    await axios.delete(`${API_BASE_URL}/clients/${id}`);
    return true;
  },
};

export const InvoiceService = {
  async fetchAll(): Promise<Invoice[]> {
    const response = await axios.get(`${API_BASE_URL}/invoices`);
    return response.data;
  },

  async fetchByClientId(clientId: number): Promise<Invoice[]> {
    const response = await axios.get(
      `${API_BASE_URL}/invoices/client/${clientId}`
    );
    return response.data;
  },

  async create(invoiceData: Partial<Invoice>): Promise<Invoice | null> {
    const response = await axios.post(`${API_BASE_URL}/invoices`, invoiceData);
    return response.data;
  },

  async update(
    id: number,
    invoiceData: Partial<Invoice>
  ): Promise<Invoice | null> {
    const response = await axios.put(
      `${API_BASE_URL}/invoices/${id}`,
      invoiceData
    );
    return response.data;
  },

  async delete(id: number): Promise<boolean> {
    await axios.delete(`${API_BASE_URL}/invoices/${id}`);
    return true;
  },
};

export const QuoteService = {
  async fetchAll(): Promise<Quote[]> {
    const response = await axios.get(`${API_BASE_URL}/quotes`);
    return response.data;
  },

  async create(quoteData: Partial<Quote>): Promise<Quote | null> {
    const response = await axios.post(`${API_BASE_URL}/quotes`, quoteData);
    return response.data;
  },

  async update(id: number, quoteData: Partial<Quote>): Promise<Quote | null> {
    const response = await axios.put(`${API_BASE_URL}/quotes/${id}`, quoteData);
    return response.data;
  },

  async delete(id: number): Promise<boolean> {
    await axios.delete(`${API_BASE_URL}/quotes/${id}`);
    return true;
  },
};

export const TaskService = {
  async fetchAll(): Promise<Task[]> {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  },

  async create(taskData: Partial<Task>): Promise<Task | null> {
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
    return response.data;
  },

  async update(id: number, taskData: Partial<Task>): Promise<Task | null> {
    const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, taskData);
    return response.data;
  },

  async delete(id: number): Promise<boolean> {
    await axios.delete(`${API_BASE_URL}/tasks/${id}`);
    return true;
  },
};

export const DocumentService = {
  async fetchAll(): Promise<Document[]> {
    const response = await axios.get(`${API_BASE_URL}/documents`);
    return response.data;
  },

  async uploadDocument(
    file: File,
    folderId?: number
  ): Promise<Document | null> {
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
  },

  async delete(id: number): Promise<boolean> {
    await axios.delete(`${API_BASE_URL}/documents/${id}`);
    return true;
  },
};

export const CompanyService = {
  async fetchCompany(): Promise<Company | null> {
    const response = await axios.get(`${API_BASE_URL}/company`);
    return response.data;
  },

  async updateCompany(companyData: Partial<Company>): Promise<boolean> {
    const response = await axios.put(`${API_BASE_URL}/company`, companyData);
    return response.data.success;
  },
};

export const RevenueService = {
  async fetchAll(): Promise<Revenue[]> {
    const response = await axios.get(`${API_BASE_URL}/revenues`);
    return response.data;
  },
};

export const PaymentService = {
  async fetchAll(): Promise<Payment[]> {
    const response = await axios.get(`${API_BASE_URL}/payments`);
    return response.data;
  },

  async create(paymentData: Partial<Payment>): Promise<Payment | null> {
    const response = await axios.post(`${API_BASE_URL}/payments`, paymentData);
    return response.data;
  },

  async update(
    id: number,
    paymentData: Partial<Payment>
  ): Promise<Payment | null> {
    const response = await axios.put(
      `${API_BASE_URL}/payments/${id}`,
      paymentData
    );
    return response.data;
  },

  async delete(id: number): Promise<boolean> {
    await axios.delete(`${API_BASE_URL}/payments/${id}`);
    return true;
  },
};
