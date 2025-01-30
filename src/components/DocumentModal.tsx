import React, { useState, useEffect } from 'react'
    import { X } from 'lucide-react'

    interface Document {
      id: string
      name: string
      file: string
      folderId: string | null
    }

    interface Folder {
      id: string
      name: string
    }

    interface DocumentModalProps {
      isOpen: boolean
      onClose: () => void
      onSave: (document: Document) => void
      document: Document | null
      folders: Folder[]
    }

    const DocumentModal: React.FC<DocumentModalProps> = ({
      isOpen,
      onClose,
      onSave,
      document,
      folders,
    }) => {
      const [name, setName] = useState('')
      const [folderId, setFolderId] = useState<string | null>(null)

      useEffect(() => {
        if (document) {
          setName(document.name)
          setFolderId(document.folderId)
        } else {
          setName('')
          setFolderId(null)
        }
      }, [document])

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!document) return
        const newDocument: Document = {
          ...document,
          name,
          folderId,
        }
        onSave(newDocument)
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
              {document ? 'Modifier le document' : 'Nouveau document'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Nom du document
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
                  htmlFor="folderId"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Dossier
                </label>
                <select
                  id="folderId"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={folderId || ''}
                  onChange={(e) =>
                    setFolderId(e.target.value === '' ? null : e.target.value)
                  }
                >
                  <option value="">Aucun dossier</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
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
                  {document ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    export default DocumentModal
