import { 
  Client, 
  Task, 
  Invoice, 
  Quote, 
  Document, 
  Folder, 
  Company, 
  Revenue,
  Payment 
} from '../types/database'

export const mockClients: Client[] = [
  {
    id: 1,
    name: 'Entreprise Tech Solutions',
    address: '12 rue de l\'Innovation',
    postalCode: '75001',
    city: 'Paris',
    email: 'contact@techsolutions.fr',
    phone: '01 23 45 67 89',
    creationDate: '2024-01-15',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    comments: 'Client potentiel pour projet web'
  },
  {
    id: 2,
    name: 'Agence Créative Média',
    address: '45 avenue des Créateurs',
    postalCode: '69002',
    city: 'Lyon',
    email: 'bonjour@agencecreative.com',
    phone: '04 56 78 90 12',
    creationDate: '2024-02-01',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    comments: 'Collaboration en cours de discussion'
  }
]

export const mockTasks: Task[] = [
  {
    id: 1,
    name: 'Finaliser devis projet web',
    description: 'Compléter le devis pour le client Tech Solutions',
    completed: false
  },
  {
    id: 2,
    name: 'Réunion de suivi',
    description: 'Appel avec l\'Agence Créative Média',
    completed: false
  },
  {
    id: 3,
    name: 'Envoyer facture',
    description: 'Facturation du projet de janvier',
    completed: true
  }
]

export const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-001',
    creationDate: '2024-01-15',
    dueDate: '2024-02-15',
    clientId: 1,
    pdfUrl: '/invoices/inv-001.pdf',
    total: 2500,
    items: [
      {
        description: 'Développement site web',
        quantity: 2,
        unitPrice: 1250
      }
    ]
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-002',
    creationDate: '2024-02-01',
    dueDate: '2024-03-01',
    clientId: 2,
    pdfUrl: '/invoices/inv-002.pdf',
    total: 3200,
    items: [
      {
        description: 'Design graphique',
        quantity: 1,
        unitPrice: 3200
      }
    ]
  }
]

export const mockQuotes: Quote[] = [
  {
    id: 1,
    quoteNumber: 'QUOTE-2024-001',
    creationDate: '2024-01-10',
    validUntil: '2024-02-10',
    clientId: 1,
    pdfUrl: '/quotes/quote-001.pdf',
    total: 5000,
    items: [
      {
        description: 'Développement application mobile',
        quantity: 1,
        unitPrice: 5000
      }
    ]
  },
  {
    id: 2,
    quoteNumber: 'QUOTE-2024-002',
    creationDate: '2024-02-05',
    validUntil: '2024-03-05',
    clientId: 2,
    pdfUrl: '/quotes/quote-002.pdf',
    total: 4500,
    items: [
      {
        description: 'Refonte identité visuelle',
        quantity: 1,
        unitPrice: 4500
      }
    ]
  }
]

export const mockRevenues: Revenue[] = [
  { month: 'Janvier', amount: 12500 },
  { month: 'Février', amount: 15000 },
  { month: 'Mars', amount: 11800 }
]

export const mockFolders: Folder[] = [
  { id: 1, name: 'Documents Légaux', description: 'Documents officiels et juridiques' },
  { id: 2, name: 'Contrats', description: 'Contrats clients et fournisseurs' },
  { id: 3, name: 'Documents Financiers', description: 'Bilans, relevés bancaires' }
]

export const mockDocuments: Document[] = [
  {
    id: 1,
    name: 'Statuts de la société',
    file: '/documents/statuts.pdf',
    folderId: 1,
    uploadDate: '2024-01-15',
    type: 'legal'
  },
  {
    id: 2,
    name: 'Bilan 2023',
    file: '/documents/bilan-2023.pdf',
    folderId: 3,
    uploadDate: '2024-02-01',
    type: 'financial'
  }
]

export const mockCompany: Company = {
  id: 1,
  companyName: 'FreelanceBox SARL',
  siretNumber: '123 456 789 00015',
  logoUrl: 'https://via.placeholder.com/400x400.png?text=FreelanceBox+Logo',
  address: '15 rue de l\'Innovation',
  postalCode: '75010',
  city: 'Paris',
  phone: '01 23 45 67 89',
  email: 'contact@freelancebox.fr',
  taxIdentification: 'FR12345678900',
  businessSector: 'Services Informatiques',
  foundedDate: '2022-01-01'
}

export const mockPayments: Payment[] = [
  {
    id: 1,
    invoiceId: 1,
    amount: 2500,
    paymentDate: '2024-02-15',
    paymentMethod: 'virement',
    status: 'payé',
    reference: 'VIR-2024-001'
  },
  {
    id: 2,
    invoiceId: 2,
    amount: 1600,
    paymentDate: '2024-02-20',
    paymentMethod: 'chèque',
    status: 'partiel',
    reference: 'CHQ-2024-002'
  }
]
