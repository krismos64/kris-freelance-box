import axios from "axios";
import {
  Client,
  Document,
  Folder,
  Invoice,
  Payment,
  Quote,
  Revenue,
  Task,
  ClientStats,
  TaskStats,
  InvoiceStats,
  QuoteItem,
  Company,
} from "../types/database";

// Configurer Axios avec l'URL de base de l'API
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5002/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API :", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Services liés à chaque entité

export const ClientService = {
  async fetchAll(): Promise<Client[]> {
    const response = await apiClient.get("/clients");
    return response.data;
  },

  async fetchById(clientId: number): Promise<Client> {
    const response = await apiClient.get(`/clients/${clientId}`);
    console.log("Client data récupérée :", response.data);
    return response.data;
  },

  async create(clientData: Partial<Client> | FormData): Promise<Client> {
    const response = await apiClient.post("/clients", clientData, {
      headers:
        clientData instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : {},
    });
    return response.data;
  },

  async update(
    clientId: number,
    clientData: Partial<Client> | FormData
  ): Promise<Client> {
    const response = await apiClient.put(`/clients/${clientId}`, clientData, {
      headers:
        clientData instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : {},
    });
    return response.data;
  },

  async delete(clientId: number): Promise<void> {
    await apiClient.delete(`/clients/${clientId}`);
  },

  async search(searchTerm: string): Promise<Client[]> {
    const response = await apiClient.get(`/clients/search`, {
      params: { q: searchTerm },
    });
    return response.data;
  },

  async fetchStatistics(): Promise<ClientStats> {
    const response = await apiClient.get("/clients/stats");
    return response.data;
  },
};

export const InvoiceService = {
  async fetchAll(): Promise<Invoice[]> {
    const response = await apiClient.get("/invoices");
    return response.data;
  },

  async fetchById(invoiceId: number): Promise<Invoice> {
    const response = await apiClient.get(`/invoices/${invoiceId}`);
    return response.data;
  },

  async fetchStatistics(): Promise<InvoiceStats> {
    const response = await apiClient.get("/invoices/stats");
    return response.data;
  },

  async create(invoiceData: Partial<Invoice>): Promise<Invoice> {
    const response = await apiClient.post("/invoices", invoiceData);
    return response.data;
  },

  async update(
    invoiceId: number,
    invoiceData: Partial<Invoice>
  ): Promise<Invoice> {
    const response = await apiClient.put(`/invoices/${invoiceId}`, invoiceData);
    return response.data;
  },

  async delete(invoiceId: number): Promise<void> {
    await apiClient.delete(`/invoices/${invoiceId}`);
  },

  async search(searchTerm: string): Promise<Invoice[]> {
    const response = await apiClient.get(`/invoices/search`, {
      params: { q: searchTerm },
    });
    return response.data;
  },
};

export const QuoteService = {
  async fetchAll(): Promise<Quote[]> {
    const response = await apiClient.get("/quotes");
    return response.data;
  },

  async fetchById(quoteId: number): Promise<Quote> {
    const response = await apiClient.get(`/quotes/${quoteId}`);
    return response.data;
  },

  async create(quoteData: Partial<Quote>): Promise<Quote> {
    const response = await apiClient.post("/quotes", quoteData);
    return response.data;
  },

  async update(quoteId: number, quoteData: Partial<Quote>): Promise<Quote> {
    const response = await apiClient.put(`/quotes/${quoteId}`, quoteData);
    return response.data;
  },

  async delete(quoteId: number): Promise<void> {
    await apiClient.delete(`/quotes/${quoteId}`);
  },

  async search(searchTerm: string): Promise<Quote[]> {
    const response = await apiClient.get(`/quotes/search`, {
      params: { q: searchTerm },
    });
    return response.data;
  },

  async fetchItems(quoteId: number): Promise<QuoteItem[]> {
    const response = await apiClient.get(`/quotes/${quoteId}/items`);
    return response.data;
  },
};

export const TaskService = {
  async fetchAll(): Promise<Task[]> {
    const response = await apiClient.get("/tasks");
    return response.data;
  },

  async fetchStatistics(): Promise<TaskStats> {
    const response = await apiClient.get("/tasks/stats");
    return response.data;
  },

  async create(taskData: Partial<Task>): Promise<Task> {
    const response = await apiClient.post("/tasks", taskData);
    return response.data;
  },

  async update(taskId: number, taskData: Partial<Task>): Promise<Task> {
    const response = await apiClient.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  async delete(taskId: number): Promise<void> {
    await apiClient.delete(`/tasks/${taskId}`);
  },

  async search(searchTerm: string): Promise<Task[]> {
    const response = await apiClient.get(`/tasks/search`, {
      params: { q: searchTerm },
    });
    return response.data;
  },
};

export const DocumentService = {
  async fetchAll(): Promise<Document[]> {
    const response = await apiClient.get("/documents");
    return response.data;
  },

  async fetchFolders(): Promise<Folder[]> {
    const response = await apiClient.get("/folders");
    return response.data;
  },

  async createFolder(folderData: { name: string }): Promise<Folder> {
    const response = await apiClient.post("/folders", folderData);
    return response.data;
  },

  async deleteFolder(folderId: number): Promise<void> {
    await apiClient.delete(`/folders/${folderId}`);
  },

  async upload(file: File, folderId?: number): Promise<Document> {
    const formData = new FormData();
    formData.append("file", file);
    if (folderId) formData.append("folderId", folderId.toString());

    const response = await apiClient.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  async download(doc: Document): Promise<void> {
    const response = await apiClient.get(`/documents/${doc.id}/download`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", doc.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async delete(documentId: number): Promise<void> {
    await apiClient.delete(`/documents/${documentId}`);
  },

  async search(searchTerm: string): Promise<Document[]> {
    const response = await apiClient.get(`/documents/search`, {
      params: { q: searchTerm },
    });
    return response.data;
  },
};

export const DashboardService = {
  async fetchRevenues(): Promise<Revenue[]> {
    const response = await apiClient.get("/dashboard/revenues");
    return response.data;
  },

  async fetchClientStats(): Promise<ClientStats> {
    const response = await apiClient.get("/dashboard/clients/stats");
    return response.data;
  },

  async fetchTaskStats(): Promise<TaskStats> {
    const response = await apiClient.get("/dashboard/tasks/stats");
    return response.data;
  },

  async fetchInvoiceStats(): Promise<InvoiceStats> {
    const response = await apiClient.get("/dashboard/invoices/stats");
    return response.data;
  },

  async fetchGlobalStatistics(): Promise<{
    totalRevenue: number;
    clientCount: number;
    invoiceCount: number;
    taskCount: number;
  }> {
    const response = await apiClient.get("/dashboard/global-stats");
    return response.data;
  },
};

export const RevenueService = {
  async fetchAll(): Promise<Revenue[]> {
    const response = await apiClient.get("/revenues");
    return response.data;
  },
};

export const PaymentService = {
  async fetchAll(): Promise<Payment[]> {
    const response = await apiClient.get("/payments");
    return response.data;
  },

  async create(paymentData: Partial<Payment>): Promise<Payment> {
    const response = await apiClient.post("/payments", paymentData);
    return response.data;
  },

  async delete(paymentId: number): Promise<void> {
    await apiClient.delete(`/payments/${paymentId}`);
  },
};

export const CompanyService = {
  async fetchCompanyInfo(): Promise<Company> {
    const response = await apiClient.get("/company");
    return response.data;
  },

  async updateCompanyInfo(companyData: Partial<Company>): Promise<Company> {
    const response = await apiClient.put("/company", companyData);
    return response.data;
  },
};
