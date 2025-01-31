import React, { useState } from 'react'
import { Plus, Search, Filter, Eye, Trash2, Download } from 'lucide-react'
import { mockInvoices } from '../mocks/mockData'
import { mockClients } from '../mocks/mockData'
import InvoiceForm from '../components/forms/InvoiceForm'
import { Invoice } from '../types/database'
import { pdfGenerator } from '../services/pdfGenerator'
import PDFViewer from '../components/PDFViewer'

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState(mockInvoices)
  const [isAddingInvoice, setIsAddingInvoice] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value
    setSearchTerm(term)
  }

  const handleAddInvoice = (newInvoice: Partial<Invoice>) => {
    const invoiceToAdd = {
      ...newInvoice,
      id: invoices.length + 1,
    } as Invoice

    setInvoices([...invoices, invoiceToAdd])
    setIsAddingInvoice(false)
  }

  const handleDeleteInvoice = (invoiceId: number) => {
    setInvoices(invoices.filter(invoice => invoice.id !== invoiceId))
  }

  const getClientName = (clientId: number) => {
    const client = mockClients.find(c => c.id === clientId)
    return client ? client.name : 'Client inconnu'
  }

  return (
    <div className="p-6 bg-white/5 rounded-xl">
      {selectedInvoice && (
        <PDFViewer 
          document={selectedInvoice}
          client={mockClients.find(c => c.id === selectedInvoice.clientId)!}
          type="invoice"
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Mes Factures</h1>
        <div className="flex space-x-4">
          <button 
            onClick={() => setIsAddingInvoice(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="mr-2" /> Nouvelle Facture
          </button>
        </div>
      </div>

      {isAddingInvoice && (
        <div className="mb-6">
          <InvoiceForm 
            onSubmit={handleAddInvoice}
            onCancel={() => setIsAddingInvoice(false)}
          />
        </div>
      )}

      <div className="flex mb-6 space-x-4">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Rechercher une facture..." 
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 pl-10"
          />
          <Search className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button className="bg-white/10 text-white px-4 py-2 rounded-lg flex items-center">
          <Filter className="mr-2" /> Filtres
        </button>
      </div>

      <div className="space-y-4">
        {invoices.map(invoice => (
          <div 
            key={invoice.id} 
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold text-white">
                {invoice.invoiceNumber}
              </h3>
              <p className="text-gray-400">
                {getClientName(invoice.clientId)} - {new Date(invoice.creationDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-green-400 font-bold">
                {invoice.total} €
              </span>
              <button 
                onClick={() => {
                  const client = mockClients.find(c => c.id === invoice.clientId)
                  if (client) {
                    pdfGenerator.generateInvoicePDF(invoice, client)
                  }
                }}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Download />
              </button>
              <button 
                onClick={() => setSelectedInvoice(invoice)}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Eye />
              </button>
              <button 
                onClick={() => handleDeleteInvoice(invoice.id)}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InvoicesPage
