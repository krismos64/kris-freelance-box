interface BaseEntity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Client extends BaseEntity {
  name: string;
  address?: string;
  postalCode?: string;
  city?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  comments?: string;
  creationDate?: Date;
}

// Interface Task
export interface Task extends BaseEntity {
  name: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
}

// Interface Invoice - Héritant de Document
export interface Invoice extends Document {
  invoiceNumber: string;
  issuedAt: Date;
  dueDate: Date;
  clientId: number;
  total: number;
  status?: "draft" | "sent" | "paid" | "overdue";
  client?: Client;
  items?: InvoiceItem[];
  creationDate?: Date;
}

// Interface InvoiceItem
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

// Interface Quote - Héritant de Document
export interface Quote extends Document {
  quoteNumber: string;
  issuedAt: Date;
  validUntil: Date;
  clientId: number;
  total: number;
  client?: Client;
  items?: QuoteItem[];
  creationDate?: Date;
}

// Interface QuoteItem
export interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

// Interface Document
export interface Document extends BaseEntity {
  name: string;
  file: string;
  folderId: number;
  uploadDate?: Date;
  pdfUrl: string;
  description?: string;
  type: DocumentType; // Assurez-vous que ce champ est obligatoire
}

// Type DocumentType - Inclut "invoice" et "quote" pour correction des erreurs
export type DocumentType =
  | "legal"
  | "financial"
  | "contract"
  | "other"
  | "invoice"
  | "document"
  | "quote";

// Interface Folder
export interface Folder extends BaseEntity {
  name: string;
  description?: string;
}

// Interface Company
export interface Company extends BaseEntity {
  name: string;
  registrationNumber: string;
  logoUrl?: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
}

// Interface Revenue
export interface Revenue {
  year: number;
  month: number;
  monthName: string;
  amount: number;
  lastUpdated: Date;
}

// Interface Payment
export interface Payment extends BaseEntity {
  invoiceId: number;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
}

// Types liés au paiement
export type PaymentMethod = "espèces" | "virement" | "chèque" | "carte";
export type PaymentStatus = "payé" | "partiel" | "en attente";

// Interface ClientStats
export interface ClientStats {
  count: number; // Nombre total de clients
  newClients?: number; // Clients ajoutés récemment
}

// Interface TaskStats
export interface TaskStats {
  totalTasks: number; // Nombre total de tâches
  incompleteTasks: number; // Nombre de tâches incomplètes
  completedTasks: number; // Nombre de tâches complétées
}

// Interface InvoiceStats
export interface InvoiceStats {
  count: number; // Nombre total de factures émises
  quoteCount: number; // Nombre total de devis
  averageValue: number; // Valeur moyenne des factures
}
