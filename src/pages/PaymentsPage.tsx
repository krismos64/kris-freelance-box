import React, { useState, useMemo } from 'react'
import { 
  DollarSign, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Trash2 
} from 'lucide-react'
import { mockPayments, mockInvoices, mockClients } from '../mocks/mockData'
import { Payment, Invoice, Client } from '../types/database'

const PaymentStatusBadge: React.FC<{ status: Payment['status'] }> = ({ status }) => {
  const statusColors = {
    'payé': 'bg-green-500',
    'partiel': 'bg-yellow-500',
    'en attente': 'bg-red-500'
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs text-white ${statusColors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState(mockPayments)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<Payment['status'] | 'tous'>('tous')
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    paymentMethod: 'virement',
    status: 'en attente'
  })

  // Récupérer les informations de la facture et du client
  const getInvoiceDetails = (invoiceId: number) => {
    const invoice = mockInvoices.find(inv => inv.id === invoiceId)
    const client = invoice ? mockClients.find(c => c.id === invoice.clientId) : null
    return { invoice, client }
  }

  // Filtrage et recherche des paiements
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const { invoice, client } = getInvoiceDetails(payment.invoiceId)
      const matchesSearch = 
        invoice?.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === 'tous' || payment.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [payments, searchTerm, filterStatus])

  // Ajouter un nouveau paiement
  const handleAddPayment = () => {
    if (newPayment.invoiceId && newPayment.amount) {
      const payment: Payment = {
        ...newPayment,
        id: payments.length + 1,
        paymentDate: new Date().toISOString().split('T')[0]
      } as Payment

      setPayments([...payments, payment])
      setIsAddingPayment(false)
      setNewPayment({ paymentMethod: 'virement', status: 'en attente' })
    }
  }

  // Supprimer un paiement
  const handleDeletePayment = (paymentId: number) => {
    setPayments(payments.filter(p => p.id !== paymentId))
  }

  return (
    <div className="p-6 bg-white/5 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Suivi des Paiements</h1>
        <button 
          onClick={() => setIsAddingPayment(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="mr-2" /> Ajouter un Paiement
        </button>
      </div>

      {/* Formulaire d'ajout de paiement */}
      {isAddingPayment && (
        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Nouveau Paiement</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white mb-2">Facture</label>
              <select
                value={newPayment.invoiceId || ''}
                onChange={(e) => setNewPayment({...newPayment, invoiceId: Number(e.target.value)})}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
              >
                <option value="">Sélectionner une facture</option>
                {mockInvoices.map(invoice => {
                  const client = mockClients.find(c => c.id === invoice.clientId)
                  return (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNumber} - {client?.name} ({invoice.total}€)
                    </option>
                  )
                })}
              </select>
            </div>
            <div>
              <label className="block text-white mb-2">Montant</label>
              <input
                type="number"
                value={newPayment.amount || ''}
                onChange={(e) => setNewPayment({...newPayment, amount: Number(e.target.value)})}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Méthode de Paiement</label>
              <select
                value={newPayment.paymentMethod}
                onChange={(e) => setNewPayment({...newPayment, paymentMethod: e.target.value as Payment['paymentMethod']})}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
              >
                <option value="virement">Virement</option>
                <option value="chèque">Chèque</option>
                <option value="espèces">Espèces</option>
                <option value="carte">Carte</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-white mb-2">Statut</label>
            <div className="flex space-x-4">
              {['en attente', 'partiel', 'payé'].map(status => (
                <label key={status} className="flex items-center text-white">
                  <input
                    type="radio"
                    value={status}
                    checked={newPayment.status === status}
                    onChange={() => setNewPayment({...newPayment, status: status as Payment['status']})}
                    className="mr-2"
                  />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAddPayment}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Enregistrer le Paiement
            </button>
          </div>
        </div>
      )}

      {/* Filtres et Recherche */}
      <div className="flex mb-6 space-x-4">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Rechercher un paiement..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 pl-10"
          />
          <Search className="absolute left-3 top-3 text-gray-400" />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Payment['status'] | 'tous')}
          className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
        >
          <option value="tous">Tous les statuts</option>
          <option value="payé">Payé</option>
          <option value="partiel">Partiel</option>
          <option value="en attente">En Attente</option>
        </select>
      </div>

      {/* Liste des Paiements */}
      <div className="space-y-4">
        {filteredPayments.map(payment => {
          const { invoice, client } = getInvoiceDetails(payment.invoiceId)
          
          return (
            <div 
              key={payment.id} 
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 flex justify-between items-center"
            >
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <DollarSign className="text-blue-400" />
                  <h3 className="text-xl font-bold text-white">
                    {invoice?.invoiceNumber}
                  </h3>
                  <PaymentStatusBadge status={payment.status} />
                </div>
                <p className="text-white/70">
                  Client: {client?.name}
                </p>
                <p className="text-white/70">
                  Référence: {payment.reference || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">
                  {payment.amount}€
                </p>
                <p className="text-white/70">
                  Payé le {new Date(payment.paymentDate).toLocaleDateString()}
                </p>
                <p className="text-white/70">
                  {payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="text-blue-400 hover:text-blue-600"
                >
                  <Eye />
                </button>
                <button 
                  onClick={() => handleDeletePayment(payment.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PaymentsPage
