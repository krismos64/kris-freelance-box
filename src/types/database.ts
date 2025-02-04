// Types de données pour l'application FreelanceBox

export interface Client {
  id: number;
  name: string;
  address?: string;
  postalCode?: string;
  city?: string;
  email?: string;
  phone?: string;
  creationDate?: Date;
  updatedAt?: Date;
  imageUrl?: string;
  comments?: string;
}

export interface Task {
  id: number;
  name: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  creationDate: Date;
  dueDate: Date;
  clientId: number;
  pdfUrl?: string;
  total: number;
  status?: "draft" | "sent" | "paid" | "overdue";
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: number;
  quoteNumber: string;
  creationDate: Date;
  validUntil: Date;
  clientId: number;
  pdfUrl?: string;
  total: number;
  items?: QuoteItem[];
}

export interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Document {
  id: number;
  name: string;
  file: string;
  folderId: number;
  uploadDate?: Date;
  description?: string;
  type?: DocumentType;
}

export type DocumentType = "legal" | "financial" | "contract" | "other";

export interface Folder {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
}

export interface Company {
  id: number;
  companyName: string;
  siretNumber: string;
  logoUrl?: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  taxIdentification?: string;
  businessSector?: string;
  foundedDate?: Date;
}

export interface Revenue {
  year: number;
  month: number;
  monthName: string;
  amount: number;
  lastUpdated: Date;
}

export interface Payment {
  id: number;
  invoiceId: number;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
}

export type PaymentMethod = "espèces" | "virement" | "chèque" | "carte";
export type PaymentStatus = "payé" | "partiel" | "en attente";
