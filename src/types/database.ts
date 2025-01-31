// Types de données pour l'application FreelanceBox

export interface Client {
  id: number
  name: string
  address?: string
  postalCode?: string
  city?: string
  email?: string
  phone?: string
  creationDate?: string
  imageUrl?: string
  comments?: string
}

export interface Task {
  id: number
  name: string
  description?: string
  completed: boolean
}

export interface Invoice {
  id: number
  invoiceNumber: string
  creationDate: string
  dueDate: string
  clientId: number
  pdfUrl?: string
  total: number
  items?: {
    description: string
    quantity: number
    unitPrice: number
  }[]
}

export interface Quote {
  id: number
  quoteNumber: string
  creationDate: string
  validUntil: string
  clientId: number
  pdfUrl?: string
  total: number
  items?: {
    description: string
    quantity: number
    unitPrice: number
  }[]
}

export interface Document {
  id: number
  name: string
  file: string
  folderId: number
  uploadDate?: string
  description?: string
  type?: 'legal' | 'financial' | 'contract' | 'other'
}

export interface Folder {
  id: number
  name: string
  description?: string
}

export interface Company {
  id: number
  companyName: string
  siretNumber: string
  logoUrl?: string
  address: string
  postalCode: string
  city: string
  phone: string
  email: string
  taxIdentification?: string
  businessSector?: string
  foundedDate?: string
}

export interface Revenue {
  month: string
  amount: number
}

export interface Payment {
  id: number
  invoiceId: number
  amount: number
  paymentDate: string
  paymentMethod: 'espèces' | 'virement' | 'chèque' | 'carte'
  status: 'payé' | 'partiel' | 'en attente'
  reference?: string
}
