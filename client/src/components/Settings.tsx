import React, { useState, useRef } from 'react'

    const Settings: React.FC = () => {
      const [companyName, setCompanyName] = useState('')
      const [siretNumber, setSiretNumber] = useState('')
      const [logoUrl, setLogoUrl] = useState('')
      const [address, setAddress] = useState('')
      const [postalCode, setPostalCode] = useState('')
      const [city, setCity] = useState('')
      const [phone, setPhone] = useState('')
      const [email, setEmail] = useState('')
      const fileInputRef = useRef<HTMLInputElement>(null)

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Save settings to local storage
        const settings = {
          companyName,
          siretNumber,
          logoUrl,
          address,
          postalCode,
          city,
          phone,
          email,
        }
        localStorage.setItem('companySettings', JSON.stringify(settings))
        alert('Settings saved!')
      }

      const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              setLogoUrl(reader.result)
            }
          }
          reader.readAsDataURL(file)
        }
      }

      const handleOpenFileDialog = () => {
        fileInputRef.current?.click()
      }

      return (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Paramètres de l'entreprise</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="companyName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Nom de l'entreprise
              </label>
              <input
                type="text"
                id="companyName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="siretNumber"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Numéro de SIRET
              </label>
              <input
                type="text"
                id="siretNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={siretNumber}
                onChange={(e) => setSiretNumber(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="logoUrl"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Logo
              </label>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Company Logo"
                  className="w-20 h-20 rounded-full object-cover mb-2"
                />
              )}
              <input
                type="file"
                id="logoUrl"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleImageUpload}
                ref={fileInputRef}
              />
              <button
                type="button"
                onClick={handleOpenFileDialog}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Télécharger le logo
              </button>
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Adresse
              </label>
              <textarea
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
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Enregistrer
            </button>
          </form>
        </div>
      )
    }

    export default Settings
