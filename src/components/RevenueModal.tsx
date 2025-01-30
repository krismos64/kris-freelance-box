import React, { useState, useEffect } from 'react'
    import { X } from 'lucide-react'

    interface Revenue {
      id: string
      date: string
      amount: number
    }

    interface RevenueModalProps {
      isOpen: boolean
      onClose: () => void
      onSave: (revenue: Revenue) => void
      revenue: Revenue | null
    }

    const RevenueModal: React.FC<RevenueModalProps> = ({
      isOpen,
      onClose,
      onSave,
      revenue,
    }) => {
      const [date, setDate] = useState('')
      const [amount, setAmount] = useState(0)

      useEffect(() => {
        if (revenue) {
          setDate(revenue.date)
          setAmount(revenue.amount)
        } else {
          setDate(new Date().toISOString().split('T')[0])
          setAmount(0)
        }
      }, [revenue])

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newRevenue: Revenue = {
          id: revenue?.id || String(Date.now()),
          date,
          amount,
        }
        onSave(newRevenue)
      }

      if (!isOpen) return null

      return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {revenue ? 'Modifier la recette' : 'Nouvelle recette'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="amount"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Montant
                </label>
                <input
                  type="number"
                  id="amount"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                />
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
                  {revenue ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    export default RevenueModal
