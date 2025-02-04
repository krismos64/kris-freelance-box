import axios from "axios";
import {
  Client,
  Invoice,
  Quote,
  Task,
  Document,
  Folder,
  Company,
  Revenue,
  Payment,
} from "../types/database";

// Création du client Axios global
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Gestionnaire d'erreurs global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API", error);
    return Promise.reject(error);
  }
);

export const ClientService = {
  async fetchAll(): Promise<Client[]> {
    return (await apiClient.get("/clients")).data;
  },

  async fetchById(id: number): Promise<Client> {
    return (await apiClient.get(`/clients/${id}`)).data;
  },

  async create(clientData: Partial<Client>): Promise<Client> {
    return (await apiClient.post("/clients", clientData)).data;
  },

  async update(id: number, clientData: Partial<Client>): Promise<Client> {
    return (await apiClient.put(`/clients/${id}`, clientData)).data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/clients/${id}`);
  },

  async search(query: string): Promise<Client[]> {
    return (await apiClient.get(`/clients/search`, { params: { q: query } }))
      .data;
  },
};

export const InvoiceService = {
  async fetchAll(): Promise<Invoice[]> {
    return (await apiClient.get("/invoices")).data;
  },

  async create(invoiceData: Partial<Invoice>): Promise<Invoice> {
    return (await apiClient.post("/invoices", invoiceData)).data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/invoices/${id}`);
  },

  async search(query: string): Promise<Invoice[]> {
    return (await apiClient.get(`/invoices/search`, { params: { q: query } }))
      .data;
  },
};

export const QuoteService = {
  async fetchAll(): Promise<Quote[]> {
    return (await apiClient.get("/quotes")).data;
  },

  async create(quoteData: Partial<Quote>): Promise<Quote> {
    return (await apiClient.post("/quotes", quoteData)).data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/quotes/${id}`);
  },

  async search(query: string): Promise<Quote[]> {
    return (await apiClient.get(`/quotes/search`, { params: { q: query } }))
      .data;
  },
};

export const TaskService = {
  async fetchAll(): Promise<Task[]> {
    return (await apiClient.get("/tasks")).data;
  },

  async create(taskData: Partial<Task>): Promise<Task> {
    return (await apiClient.post("/tasks", taskData)).data;
  },

  async toggleCompletion(id: number): Promise<Task> {
    return (await apiClient.put(`/tasks/${id}/toggle-completion`)).data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async search(query: string): Promise<Task[]> {
    return (await apiClient.get(`/tasks/search`, { params: { q: query } }))
      .data;
  },
};

export const DocumentService = {
  async fetchAll(): Promise<Document[]> {
    return (await apiClient.get("/documents")).data;
  },

  async fetchFolders(): Promise<Folder[]> {
    return (await apiClient.get("/folders")).data;
  },

  async upload(file: File, folderId?: number): Promise<Document> {
    const formData = new FormData();
    formData.append("document", file);
    if (folderId) formData.append("folderId", folderId.toString());
    return (
      await apiClient.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/documents/${id}`);
  },

  async search(query: string): Promise<Document[]> {
    return (await apiClient.get(`/documents/search`, { params: { q: query } }))
      .data;
  },
};

export const PaymentService = {
  async fetchAll(): Promise<Payment[]> {
    return (await apiClient.get("/payments")).data;
  },

  async create(paymentData: Partial<Payment>): Promise<Payment> {
    return (await apiClient.post("/payments", paymentData)).data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/payments/${id}`);
  },
};

export const DashboardService = {
  async fetchRevenues(): Promise<Revenue[]> {
    return (await apiClient.get("/dashboard/revenues")).data;
  },

  async fetchClientStats(): Promise<ClientStats> {
    return (await apiClient.get("/dashboard/clients")).data;
  },

  async fetchTaskStats(): Promise<TaskStats> {
    return (await apiClient.get("/dashboard/tasks")).data;
  },

  async fetchInvoiceStats(): Promise<InvoiceStats> {
    return (await apiClient.get("/dashboard/invoices")).data;
  },
};

export const CompanyService = {
  async fetchCompany(): Promise<Company> {
    return (await apiClient.get("/company")).data;
  },

  async updateCompany(companyData: Partial<Company>): Promise<void> {
    await apiClient.put("/company", companyData);
  },
};
