import React, { useState, useEffect } from 'react'
    import { Plus, Edit, Trash2, FileText, ChevronDown } from 'lucide-react'
    import InvoiceModal from './InvoiceModal'
    import { jsPDF } from 'jspdf'

    interface InvoiceItem {
      id: string
      description: string
      quantity: number
      unit: string
      unitPrice: number
    }

    interface Invoice {
      id: string
      invoiceNumber: string
      creationDate: string
      dueDate: string
      clientName: string
      clientAddress: string
      items: InvoiceItem[]
      pdfUrl?: string
    }

    const Invoices: React.FC = () => {
      const [invoices, setInvoices] = useState<Invoice[]>([])
      const [isModalOpen, setIsModalOpen] = useState(false)
      const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
        null,
      )
      const [selectedInvoicesToDelete, setSelectedInvoicesToDelete] = useState<
        string[]
      >([])
      const [sortOption, setSortOption] = useState<'date' | 'number'>('date')
      const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

      useEffect(() => {
        // Load invoices from local storage
        const storedInvoices = localStorage.getItem('invoices')
        if (storedInvoices) {
          setInvoices(JSON.parse(storedInvoices))
        }
      }, [])

      useEffect(() => {
        // Save invoices to local storage
        localStorage.setItem('invoices', JSON.stringify(invoices))
      }, [invoices])

      const handleAddInvoice = () => {
        setSelectedInvoice(null)
        setIsModalOpen(true)
      }

      const handleEditInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice)
        setIsModalOpen(true)
      }

      const handleDeleteInvoice = (id: string) => {
        const confirmDelete = window.confirm(
          'Êtes-vous sûr de vouloir supprimer cette facture ?',
        )
        if (confirmDelete) {
          setInvoices(invoices.filter((invoice) => invoice.id !== id))
        }
      }

      const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedInvoice(null)
      }

      const handleSaveInvoice = (invoice: Invoice) => {
        const pdfUrl = generatePdf(invoice)
        if (selectedInvoice) {
          setInvoices(
            invoices.map((q) =>
              q.id === selectedInvoice.id ? { ...invoice, pdfUrl } : q,
            ),
          )
        } else {
          setInvoices([...invoices, { ...invoice, pdfUrl }])
        }
        setIsModalOpen(false)
      }

      const handleToggleSelectInvoiceToDelete = (id: string) => {
        if (selectedInvoicesToDelete.includes(id)) {
          setSelectedInvoicesToDelete(
            selectedInvoicesToDelete.filter((invoiceId) => invoiceId !== id),
          )
        } else {
          setSelectedInvoicesToDelete([...selectedInvoicesToDelete, id])
        }
      }

      const handleDeleteSelectedInvoices = () => {
        const confirmDelete = window.confirm(
          'Êtes-vous sûr de vouloir supprimer les factures sélectionnées ?',
        )
        if (confirmDelete) {
          setInvoices(
            invoices.filter(
              (invoice) => !selectedInvoicesToDelete.includes(invoice.id),
            ),
          )
          setSelectedInvoicesToDelete([])
        }
      }

      const handleSortChange = (option: 'date' | 'number') => {
        setSortOption(option)
        setIsSortDropdownOpen(false)
      }

      const handleToggleSortDropdown = () => {
        setIsSortDropdownOpen(!isSortDropdownOpen)
      }

      const sortInvoices = (invoices: Invoice[]): Invoice[] => {
        return [...invoices].sort((a, b) => {
          if (sortOption === 'date') {
            return (
              new Date(b.creationDate).getTime() -
              new Date(a.creationDate).getTime()
            )
          } else if (sortOption === 'number') {
            return a.invoiceNumber.localeCompare(b.invoiceNumber)
          }
          return 0
        })
      }

      const generatePdf = (invoice: Invoice): string => {
        const doc = new jsPDF()
        doc.text(`Facture n°: ${invoice.invoiceNumber}`, 10, 10)
        doc.text(`Date: ${new Date(invoice.creationDate).toLocaleDateString()}`, 10, 20)
        doc.text(`Échéance: ${new Date(invoice.dueDate).toLocaleDateString()}`, 10, 30)
        doc.text(`Client: ${invoice.clientName}`, 10, 40)
        doc.text(`Adresse: ${invoice.clientAddress}`, 10, 50)

        let y = 70
        invoice.items.forEach((item) => {
          doc.text(
            `${item.description} - ${item.quantity} ${item.unit} - ${item.unitPrice}€ HT`,
            10,
            y,
          )
          y += 10
        })

        let totalHT = invoice.items.reduce(
          (acc, item) => acc + item.quantity * item.unitPrice,
          0,
        )
        doc.text(`Total HT: ${totalHT}€`, 10, y + 10)
        doc.text(
          'TVA non applicable, article 293 B du Code général des impôts',
          10,
          y + 20,
        )

        const pdfUrl = doc.output('datauristring')
        return pdfUrl
      }

      const sortedInvoices = sortInvoices(invoices)

      return (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Factures</h2>
            <div className="flex items-center space-x-2">
              {selectedInvoicesToDelete.length > 0 && (
                <button
                  onClick={handleDeleteSelectedInvoices}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center mr-2"
                >
                  <Trash2 className="mr-2" />
                  Supprimer
                </button>
              )}
              <button
                onClick={handleAddInvoice}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              >
                <Plus className="mr-2" />
                Nouvelle facture
              </button>
            </div>
          </div>
          <div className="relative mb-4">
            <button
              onClick={handleToggleSortDropdown}
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Trier par
              <ChevronDown className="ml-2" />
            </button>
            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-10">
                <button
                  onClick={() => handleSortChange('date')}
                  className={`block w-full text-left py-2 px-4 hover:bg-gray-100 ${
                    sortOption === 'date' ? 'bg-gray-100' : ''
                  }`}
                >
                  Date
                </button>
                <button
                  onClick={() => handleSortChange('number')}
                  className={`block w-full text-left py-2 px-4 hover:bg-gray-100 ${
                    sortOption === 'number' ? 'bg-gray-100' : ''
                  }`}
                >
                  Numéro
                </button>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border-b"></th>
                  <th className="py-2 px-4 border-b">Numéro</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Client</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedInvoicesToDelete.includes(invoice.id)}
                        onChange={() =>
                          handleToggleSelectInvoiceToDelete(invoice.id)
                        }
                      />
                    </td>
                    <td className="py-2 px-4 border-b">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(invoice.creationDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">{invoice.clientName}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleEditInvoice(invoice)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                      {invoice.pdfUrl && (
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:text-green-700 ml-2"
                        >
                          <FileText />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isModalOpen && (
            <InvoiceModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={handleSaveInvoice}
              invoice={selectedInvoice}
            />
          )}
        </div>
      )
    }

    export default Invoices
