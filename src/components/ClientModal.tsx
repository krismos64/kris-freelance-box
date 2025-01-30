import React, { useState, useEffect } from 'react'
    import { X } from 'lucide-react'

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

    interface ClientModalProps {
      isOpen: boolean
      onClose: () => void
      onSave: (client: Client) => void
      client: Client | null
      isEditing: boolean
    }

    const ClientModal: React.FC<ClientModalProps> = ({
      isOpen,
      onClose,
      onSave,
      client,
      isEditing,
    }) => {
      const [name, setName] = useState('')
      const [address, setAddress] = useState('')
      const [postalCode, setPostalCode] = useState('')
      const [city, setCity] = useState('')
      const [email, setEmail] = useState('')
      const [phone, setPhone] = useState('')
      const [creationDate, setCreationDate] = useState('')
      const [imageUrl, setImageUrl] = useState('')
      const [comments, setComments] = useState('')

      useEffect(() => {
        if (client) {
          setName(client.name)
          setAddress(client.address)
          setPostalCode(client.postalCode)
          setCity(client.city)
          setEmail(client.email)
          setPhone(client.phone)
          setCreationDate(client.creationDate)
          setImageUrl(client.imageUrl)
          setComments(client.comments)
        } else {
          setName('')
          setAddress('')
          setPostalCode('')
          setCity('')
          setEmail('')
          setPhone('')
          setCreationDate(new Date().toISOString().split('T')[0])
          setImageUrl('')
          setComments('')
        }
      }, [client])

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newClient: Client = {
          id: client?.id || String(Date.now()),
          name,
          address,
          postalCode,
          city,
          email,
          phone,
          creationDate,
          imageUrl,
          comments,
        }
        onSave(newClient)
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
              {isEditing ? 'Modifier le client' : 'Nouveau client'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
              <div>
                <label
                  htmlFor="address"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Adresse
                </label>
                <input
                  type="text"
                  id="address"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Code Postal
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Ville
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Image URL
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="comments"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Commentaires
                </label>
                <textarea
                  id="comments"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
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
                  {isEditing ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    export default ClientModal
