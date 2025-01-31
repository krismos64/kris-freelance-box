import React, { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mockClients, mockInvoices, mockQuotes } from '../mocks/mockData'
import { Edit, Trash2, Upload, Save, ArrowLeft } from 'lucide-react'

const ClientDetailsPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const client = mockClients.find(c => c.id === Number(id))
  const clientInvoices = mockInvoices.filter(inv => inv.clientId === Number(id))
  const clientQuotes = mockQuotes.filter(quote => quote.clientId === Number(id))

  const [isEditing, setIsEditing] = useState(false)
  const [editedClient, setEditedClient] = useState(client)
  const [imagePreview, setImagePreview] = useState(client?.imageUrl)

  if (!client) return <div>Client non trouvé</div>

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // Logique de sauvegarde (à remplacer par une vraie mise à jour)
    console.log('Client mis à jour:', editedClient)
    setIsEditing(false)
  }

  return (
    <div className="p-6 bg-white/5 rounded-xl text-white">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/clients')} 
          className="mr-4 hover:bg-white/10 p-2 rounded-full"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-3xl font-bold">Détails du Client</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Informations Client */}
        <div className="md:col-span-1 bg-white/10 rounded-xl p-6">
          <div className="relative mb-6">
            <img 
              src={imagePreview || 'https://via.placeholder.com/150'} 
              alt="Client" 
              className="w-40 h-40 rounded-full object-cover mx-auto mb-4"
            />
            {isEditing && (
              <>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden" 
                  accept="image/*"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-1/4 bg-blue-600 text-white p-2 rounded-full"
                >
                  <Upload size={20} />
                </button>
              </>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <input 
                type="text" 
                value={editedClient?.name} 
                onChange={(e) => setEditedClient({...editedClient!, name: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
              />
              <input 
                type="email" 
                value={editedClient?.email} 
                onChange={(e) => setEditedClient({...editedClient!, email: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
              />
              <input 
                type="tel" 
                value={editedClient?.phone} 
                onChange={(e) => setEditedClient({...editedClient!, phone: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
              />
              <textarea 
                value={editedClient?.comments} 
                onChange={(e) => setEditedClient({...editedClient!, comments: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
                placeholder="Commentaires"
              />
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <p className="text-gray-400">{client.email}</p>
              <p className="text-gray-400">{client.phone}</p>
              <p className="mt-4 text-sm">{client.comments}</p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {isEditing ? (
              <button 
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Save className="mr-2" /> Enregistrer
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Edit className="mr-2" /> Modifier
              </button>
            )}
            <button 
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Trash2 className="mr-2" /> Supprimer
            </button>
          </div>
        </div>

        {/* Factures */}
        <div className="md:col-span-1 bg-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Factures</h3>
          {clientInvoices.map(invoice => (
            <div 
              key={invoice.id} 
              className="bg-white/5 rounded-lg p-4 mb-3 flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{invoice.invoiceNumber}</p>
                <p className="text-sm text-gray-400">
                  {new Date(invoice.creationDate).toLocaleDateString()}
                </p>
              </div>
              <span className="font-bold text-green-400">
                {invoice.total}€
              </span>
            </div>
          ))}
        </div>

        {/* Devis */}
        <div className="md:col-span-1 bg-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Devis</h3>
          {clientQuotes.map(quote => (
            <div 
              key={quote.id} 
              className="bg-white/5 rounded-lg p-4 mb-3 flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{quote.quoteNumber}</p>
                <p className="text-sm text-gray-400">
                  {new Date(quote.creationDate).toLocaleDateString()}
                </p>
              </div>
              <span className="font-bold text-blue-400">
                {quote.total}€
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClientDetailsPage
