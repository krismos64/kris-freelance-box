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

export const mockClients: Client[] = [
  {
    id: 1,
    name: "Client A",
    email: "clientA@example.com",
    phone: "1234567890",
    address: "123 Rue A",
    postalCode: "75001",
    city: "Paris",
    imageUrl: "https://via.placeholder.com/150",
    comments: "Client A est un grand client",
    creationDate: "2023-01-01",
  },
  {
    id: 2,
    name: "Client B",
    email: "clientB@example.com",
    phone: "0987654321",
    address: "456 Rue B",
    postalCode: "75002",
    city: "Lyon",
    imageUrl: "https://via.placeholder.com/150",
    comments: "Client B est régulier",
    creationDate: "2023-02-01",
  },
  {
    id: 3,
    name: "Client C",
    email: "clientC@example.com",
    phone: "1122334455",
    address: "789 Rue C",
    postalCode: "75003",
    city: "Marseille",
    imageUrl: "https://via.placeholder.com/150",
    comments: "Client C est nouveau",
    creationDate: "2023-03-01",
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    creationDate: "2023-01-15",
    dueDate: "2023-02-15",
    clientId: 1,
    total: 1500,
    items: [{ description: "Service A", quantity: 1, unitPrice: 1500 }],
  },
  {
    id: 2,
    invoiceNumber: "INV-002",
    creationDate: "2023-02-20",
    dueDate: "2023-03-20",
    clientId: 2,
    total: 2000,
    items: [{ description: "Service B", quantity: 2, unitPrice: 1000 }],
  },
  {
    id: 3,
    invoiceNumber: "INV-003",
    creationDate: "2023-03-25",
    dueDate: "2023-04-25",
    clientId: 3,
    total: 1200,
    items: [{ description: "Service C", quantity: 1, unitPrice: 1200 }],
  },
];

export const mockQuotes: Quote[] = [
  {
    id: 1,
    quoteNumber: "QUOTE-001",
    creationDate: "2023-01-10",
    validUntil: "2023-02-10",
    clientId: 1,
    total: 1500,
    items: [{ description: "Service A", quantity: 1, unitPrice: 1500 }],
  },
  {
    id: 2,
    quoteNumber: "QUOTE-002",
    creationDate: "2023-02-15",
    validUntil: "2023-03-15",
    clientId: 2,
    total: 2000,
    items: [{ description: "Service B", quantity: 2, unitPrice: 1000 }],
  },
  {
    id: 3,
    quoteNumber: "QUOTE-003",
    creationDate: "2023-03-20",
    validUntil: "2023-04-20",
    clientId: 3,
    total: 1200,
    items: [{ description: "Service C", quantity: 1, unitPrice: 1200 }],
  },
];

export const mockTasks: Task[] = [
  {
    id: 1,
    name: "Tâche A",
    description: "Description de la tâche A",
    completed: false,
  },
  {
    id: 2,
    name: "Tâche B",
    description: "Description de la tâche B",
    completed: true,
  },
  {
    id: 3,
    name: "Tâche C",
    description: "Description de la tâche C",
    completed: false,
  },
];

export const mockDocuments: Document[] = [
  {
    id: 1,
    name: "Document A.pdf",
    file: "/documents/Document A.pdf",
    folderId: 1,
    uploadDate: "2023-01-01",
    type: "legal",
  },
  {
    id: 2,
    name: "Document B.pdf",
    file: "/documents/Document B.pdf",
    folderId: 2,
    uploadDate: "2023-02-01",
    type: "financial",
  },
  {
    id: 3,
    name: "Document C.pdf",
    file: "/documents/Document C.pdf",
    folderId: 1,
    uploadDate: "2023-03-01",
    type: "contract",
  },
];

export const mockFolders: Folder[] = [
  { id: 1, name: "Dossier A", description: "Description du dossier A" },
  { id: 2, name: "Dossier B", description: "Description du dossier B" },
];

export const mockCompany = {
  id: 1,
  companyName: "FreelanceBox SAS",
  siretNumber: "12345678901234",
  logoUrl: "https://placehold.co/150",
  address: "123 Rue des Freelances",
  postalCode: "75001",
  city: "Paris",
  phone: "0123456789",
  email: "contact@freelancebox.com",
  taxIdentification: "FR123456789",
  businessSector: "Services Freelance",
  foundedDate: "2020-01-01",
};

export const mockRevenues: Revenue[] = [
  {
    year: 2023,
    month: 1,
    monthName: "Janvier",
    amount: 1500,
    lastUpdated: "2023-01-31",
  },
  {
    year: 2023,
    month: 2,
    monthName: "Février",
    amount: 2000,
    lastUpdated: "2023-02-28",
  },
  {
    year: 2023,
    month: 3,
    monthName: "Mars",
    amount: 1200,
    lastUpdated: "2023-03-31",
  },
];

export const mockPayments: Payment[] = [
  {
    id: 1,
    invoiceId: 1,
    amount: 1500,
    paymentDate: "2023-02-15",
    paymentMethod: "virement",
    status: "payé",
    reference: "REF-001",
  },
  {
    id: 2,
    invoiceId: 2,
    amount: 1000,
    paymentDate: "2023-03-20",
    paymentMethod: "carte",
    status: "partiel",
    reference: "REF-002",
  },
  {
    id: 3,
    invoiceId: 3,
    amount: 1200,
    paymentDate: "2023-04-25",
    paymentMethod: "espèces",
    status: "en attente",
    reference: "REF-003",
  },
];
