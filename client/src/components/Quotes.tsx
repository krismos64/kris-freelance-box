import React, { useState, useEffect } from 'react'
    import { Plus, Edit, Trash2, FileText, ChevronDown } from 'lucide-react'
    import QuoteModal from './QuoteModal'
    import { jsPDF } from 'jspdf'

    interface QuoteItem {
      id: string
      description: string
      quantity: number
      unit: string
      unitPrice: number
    }

    interface Quote {
      id: string
      quoteNumber: string
      creationDate: string
      validUntil: string
      clientId: string
      items: QuoteItem[]
      pdfUrl?: string
    }

    interface Client {
      id: string
      name: string
      address: string
      postalCode: string
      city: string
      email: string
      phone: string
      creationDate: string
      imageUrl: string
      comments: string
    }

    const Quotes: React.FC = () => {
      const [quotes, setQuotes] = useState<Quote[]>([])
      const [clients, setClients] = useState<Client[]>([])
      const [isModalOpen, setIsModalOpen] = useState(false)
      const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
      const [selectedQuotesToDelete, setSelectedQuotesToDelete] = useState<
        string[]
      >([])
      const [sortOption, setSortOption] = useState<'date' | 'number'>('date')
      const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

      useEffect(() => {
        // Load quotes from local storage
        const storedQuotes = localStorage.getItem('quotes')
        if (storedQuotes) {
          setQuotes(JSON.parse(storedQuotes))
        }
        const storedClients = localStorage.getItem('clients')
        if (storedClients) {
          setClients(JSON.parse(storedClients))
        }
      }, [])

      useEffect(() => {
        // Save quotes to local storage
        localStorage.setItem('quotes', JSON.stringify(quotes))
      }, [quotes])

      const handleAddQuote = () => {
        setSelectedQuote(null)
        setIsModalOpen(true)
      }

      const handleEditQuote = (quote: Quote) => {
        setSelectedQuote(quote)
        setIsModalOpen(true)
      }

      const handleDeleteQuote = (id: string) => {
        const confirmDelete = window.confirm(
          'Êtes-vous sûr de vouloir supprimer ce devis ?',
        )
        if (confirmDelete) {
          setQuotes(quotes.filter((quote) => quote.id !== id))
        }
      }

      const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedQuote(null)
      }

      const handleSaveQuote = (quote: Quote) => {
        const pdfUrl = generatePdf(quote)
        if (selectedQuote) {
          setQuotes(
            quotes.map((q) =>
              q.id === selectedQuote.id ? { ...quote, pdfUrl } : q,
            ),
          )
        } else {
          setQuotes([...quotes, { ...quote, pdfUrl }])
        }
        setIsModalOpen(false)
      }

      const handleToggleSelectQuoteToDelete = (id: string) => {
        if (selectedQuotesToDelete.includes(id)) {
          setSelectedQuotesToDelete(
            selectedQuotesToDelete.filter((quoteId) => quoteId !== id),
          )
        } else {
          setSelectedQuotesToDelete([...selectedQuotesToDelete, id])
        }
      }

      const handleDeleteSelectedQuotes = () => {
        const confirmDelete = window.confirm(
          'Êtes-vous sûr de vouloir supprimer les devis sélectionnés ?',
        )
        if (confirmDelete) {
          setQuotes(
            quotes.filter((quote) => !selectedQuotesToDelete.includes(quote.id)),
          )
          setSelectedQuotesToDelete([])
        }
      }

      const handleSortChange = (option: 'date' | 'number') => {
        setSortOption(option)
        setIsSortDropdownOpen(false)
      }

      const handleToggleSortDropdown = () => {
        setIsSortDropdownOpen(!isSortDropdownOpen)
      }

      const sortQuotes = (quotes: Quote[]): Quote[] => {
        return [...quotes].sort((a, b) => {
          if (sortOption === 'date') {
            return (
              new Date(b.creationDate).getTime() -
              new Date(a.creationDate).getTime()
            )
          } else if (sortOption === 'number') {
            return a.quoteNumber.localeCompare(b.quoteNumber)
          }
          return 0
        })
      }

      const generatePdf = (quote: Quote): string => {
        const doc = new jsPDF()
        const client = clients.find((c) => c.id === quote.clientId)
        doc.text(`Devis n°: ${quote.quoteNumber}`, 10, 10)
        doc.text(`Date: ${new Date(quote.creationDate).toLocaleDateString()}`, 10, 20)
        doc.text(`Valide jusqu'au: ${new Date(quote.validUntil).toLocaleDateString()}`, 10, 30)
        doc.text(`Client: ${client?.name || 'N/A'}`, 10, 40)
        doc.text(`Adresse: ${client?.address || 'N/A'}`, 10, 50)

        let y = 70
        quote.items.forEach((item) => {
          doc.text(
            `${item.description} - ${item.quantity} ${item.unit} - ${item.unitPrice}€ HT`,
            10,
            y,
          )
          y += 10
        })

        let totalHT = quote.items.reduce(
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

      const sortedQuotes = sortQuotes(quotes)

      return (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Devis</h2>
            <div className="flex items-center space-x-2">
              {selectedQuotesToDelete.length > 0 && (
                <button
                  onClick={handleDeleteSelectedQuotes}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center mr-2"
                >
                  <Trash2 className="mr-2" />
                  Supprimer
                </button>
              )}
              <button
                onClick={handleAddQuote}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              >
                <Plus className="mr-2" />
                Nouveau devis
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
                {sortedQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedQuotesToDelete.includes(quote.id)}
                        onChange={() => handleToggleSelectQuoteToDelete(quote.id)}
                      />
                    </td>
                    <td className="py-2 px-4 border-b">{quote.quoteNumber}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(quote.creationDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {
                        clients.find((c) => c.id === quote.clientId)?.name ||
                        'N/A'
                      }
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleEditQuote(quote)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleDeleteQuote(quote.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                      {quote.pdfUrl && (
                        <a
                          href={quote.pdfUrl}
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
            <QuoteModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={handleSaveQuote}
              quote={selectedQuote}
              clients={clients}
            />
          )}
        </div>
      )
    }

    export default Quotes
