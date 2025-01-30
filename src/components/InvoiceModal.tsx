import React, { useState, useEffect } from 'react'
    import { X } from 'lucide-react'

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
    }

    interface InvoiceModalProps {
      isOpen: boolean
      onClose: () => void
      onSave: (invoice: Invoice) => void
      invoice: Invoice | null
    }

    const InvoiceModal: React.FC<InvoiceModalProps> = ({
      isOpen,
      onClose,
      onSave,
      invoice,
    }) => {
      const [invoiceNumber, setInvoiceNumber] = useState('')
      const [creationDate, setCreationDate] = useState('')
      const [dueDate, setDueDate] = useState('')
      const [clientName, setClientName] = useState('')
      const [clientAddress, setClientAddress] = useState('')
      const [items, setItems] = useState<InvoiceItem[]>([])
      const [newItemDescription, setNewItemDescription] = useState('')
      const [newItemQuantity, setNewItemQuantity] = useState(1)
      const [newItemUnit, setNewItemUnit] = useState('heures')
      const [newItemUnitPrice, setNewItemUnitPrice] = useState(0)

      useEffect(() => {
        if (invoice) {
          setInvoiceNumber(invoice.invoiceNumber)
          setCreationDate(invoice.creationDate)
          setDueDate(invoice.dueDate)
          setClientName(invoice.clientName)
          setClientAddress(invoice.clientAddress)
          setItems(invoice.items)
        } else {
          setInvoiceNumber(`FAC${String(Date.now()).slice(-4)}`)
          setCreationDate(new Date().toISOString().split('T')[0])
          setDueDate('')
          setClientName('')
          setClientAddress('')
          setItems([])
        }
      }, [invoice])

      const handleAddItem = () => {
        const newItem: InvoiceItem = {
          id: String(Date.now()),
          description: newItemDescription,
          quantity: newItemQuantity,
          unit: newItemUnit,
          unitPrice: newItemUnitPrice,
        }
        setItems([...items, newItem])
        setNewItemDescription('')
        setNewItemQuantity(1)
        setNewItemUnit('heures')
        setNewItemUnitPrice(0)
      }

      const handleDeleteItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id))
      }

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newInvoice: Invoice = {
          id: invoice?.id || String(Date.now()),
          invoiceNumber,
          creationDate,
          dueDate,
          clientName,
          clientAddress,
          items,
        }
        onSave(newInvoice)
      }

      if (!isOpen) return null

      return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-2xl relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {invoice ? 'Modifier la facture' : 'Nouvelle facture'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="invoiceNumber"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Numéro de facture
                  </label>
                  <input
                    type="text"
                    id="invoiceNumber"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    readOnly
                  />
                </div>
                <div>
                  <label
                    htmlFor="creationDate"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Date de création
                  </label>
                  <input
                    type="date"
                    id="creationDate"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={creationDate}
                    onChange={(e) => setCreationDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dueDate"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Date d'échéance
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="clientName"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Nom du client
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="clientAddress"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Adresse du client
                </label>
                <input
                  type="text"
                  id="clientAddress"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  required
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Détail des prestations / produits
              </h3>
              <div className="mb-4">
                <div className="grid grid-cols-5 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Description"
                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Quantité"
                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                  />
                  <select
                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                  >
                    <option value="heures">heures</option>
                    <option value="jours">jours</option>
                    <option value="pièces">pièces</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Prix unitaire HT"
                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newItemUnitPrice}
                    onChange={(e) => setNewItemUnitPrice(Number(e.target.value))}
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Ajouter
                  </button>
                </div>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="bg-white shadow rounded p-2 flex items-center justify-between"
                    >
                      <span>
                        {item.description} - {item.quantity} {item.unit} -{' '}
                        {item.unitPrice}€ HT
                      </span>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {invoice ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    export default InvoiceModal
