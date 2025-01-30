import React, { useState, useEffect, useRef } from 'react'
    import {
      Plus,
      Edit,
      Trash2,
      FolderPlus,
      File,
      Folder,
      Search,
      ChevronDown,
    } from 'lucide-react'
    import DocumentModal from './DocumentModal'
    import FolderModal from './FolderModal'
    import UploadDocumentModal from './UploadDocumentModal'

    interface Document {
      id: string
      name: string
      file: string
      folderId: string | null
      creationDate: string
    }

    interface Folder {
      id: string
      name: string
    }

    const Documents: React.FC = () => {
      const [documents, setDocuments] = useState<Document[]>([])
      const [folders, setFolders] = useState<Folder[]>([])
      const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
      const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
      const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
      const [selectedDocument, setSelectedDocument] = useState<Document | null>(
        null,
      )
      const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
      const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
      const [searchTerm, setSearchTerm] = useState('')
      const [sortOption, setSortOption] = useState<'name' | 'date' | 'type'>(
        'name',
      )
      const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
      const [selectedFoldersToDelete, setSelectedFoldersToDelete] = useState<
        string[]
      >([])
      const [selectedDocumentsToDelete, setSelectedDocumentsToDelete] =
        useState<string[]>([])
      const [uploadingFile, setUploadingFile] = useState<File | null>(null)
      const fileInputRef = useRef<HTMLInputElement>(null)

      useEffect(() => {
        // Load documents and folders from local storage
        const storedDocuments = localStorage.getItem('documents')
        if (storedDocuments) {
          setDocuments(JSON.parse(storedDocuments))
        }
        const storedFolders = localStorage.getItem('folders')
        if (storedFolders) {
          setFolders(JSON.parse(storedFolders))
        }
      }, [])

      useEffect(() => {
        // Save documents and folders to local storage
        localStorage.setItem('documents', JSON.stringify(documents))
        localStorage.setItem('folders', JSON.stringify(folders))
      }, [documents, folders])

      const handleAddDocument = () => {
        setSelectedDocument(null)
        setIsDocumentModalOpen(true)
      }

      const handleEditDocument = (document: Document) => {
        setSelectedDocument(document)
        setIsDocumentModalOpen(true)
      }

      const handleDeleteDocument = (id: string) => {
        const confirmDelete = window.confirm(
          'Êtes-vous sûr de vouloir supprimer ce document ?',
        )
        if (confirmDelete) {
          setDocuments(documents.filter((doc) => doc.id !== id))
        }
      }

      const handleCloseDocumentModal = () => {
        setIsDocumentModalOpen(false)
        setSelectedDocument(null)
      }

      const handleSaveDocument = (document: Document) => {
        if (selectedDocument) {
          setDocuments(
            documents.map((doc) => (doc.id === selectedDocument.id ? document : doc)),
          )
        } else {
          setDocuments([...documents, document])
        }
        setIsDocumentModalOpen(false)
      }

      const handleAddFolder = () => {
        setSelectedFolder(null)
        setIsFolderModalOpen(true)
      }

      const handleEditFolder = (folder: Folder) => {
        setSelectedFolder(folder)
        setIsFolderModalOpen(true)
      }

      const handleDeleteFolder = (id: string) => {
        const confirmDelete = window.confirm(
          'Êtes-vous sûr de vouloir supprimer ce dossier ?',
        )
        if (confirmDelete) {
          setFolders(folders.filter((folder) => folder.id !== id))
          setDocuments(
            documents.map((doc) =>
              doc.folderId === id ? { ...doc, folderId: null } : doc,
            ),
          )
        }
      }

      const handleCloseFolderModal = () => {
        setIsFolderModalOpen(false)
        setSelectedFolder(null)
      }

      const handleSaveFolder = (folder: Folder) => {
        if (selectedFolder) {
          setFolders(
            folders.map((f) => (f.id === selectedFolder.id ? folder : f)),
          )
        } else {
          setFolders([...folders, folder])
        }
        setIsFolderModalOpen(false)
      }

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
          setUploadingFile(file)
          setIsUploadModalOpen(true)
        }
      }

      const handleOpenFileDialog = () => {
        fileInputRef.current?.click()
      }

      const handleOpenFolder = (folderId: string | null) => {
        setCurrentFolderId(folderId)
        setSearchTerm('')
      }

      const handleGoBack = () => {
        setCurrentFolderId(null)
        setSearchTerm('')
      }

      const handleSortChange = (option: 'name' | 'date' | 'type') => {
        setSortOption(option)
        setIsSortDropdownOpen(false)
      }

      const handleToggleSortDropdown = () => {
        setIsSortDropdownOpen(!isSortDropdownOpen)
      }

      const handleToggleSelectFolderToDelete = (id: string) => {
        if (selectedFoldersToDelete.includes(id)) {
          setSelectedFoldersToDelete(
            selectedFoldersToDelete.filter((folderId) => folderId !== id),
          )
        } else {
          setSelectedFoldersToDelete([...selectedFoldersToDelete, id])
        }
      }

      const handleDeleteSelectedFolders = () => {
        const confirmDelete = window.confirm(
          'Êtes-vous sûr de vouloir supprimer les dossiers sélectionnés ?',
        )
        if (confirmDelete) {
          setFolders(
            folders.filter((folder) => !selectedFoldersToDelete.includes(folder.id)),
          )
          setDocuments(
            documents.map((doc) =>
              selectedFoldersToDelete.includes(doc.folderId || '')
                ? { ...doc, folderId: null }
                : doc,
            ),
          )
          setSelectedFoldersToDelete([])
        }
      }

      const handleToggleSelectDocumentToDelete = (id: string) => {
        if (selectedDocumentsToDelete.includes(id)) {
          setSelectedDocumentsToDelete(
            selectedDocumentsToDelete.filter((documentId) => documentId !== id),
          )
        } else {
          setSelectedDocumentsToDelete([...selectedDocumentsToDelete, id])
        }
      }

      const handleDeleteSelectedDocuments = () => {
        const confirmDelete = window.confirm(
          'Êtes-vous sûr de vouloir supprimer les documents sélectionnés ?',
        )
        if (confirmDelete) {
          setDocuments(
            documents.filter(
              (document) => !selectedDocumentsToDelete.includes(document.id),
            ),
          )
          setSelectedDocumentsToDelete([])
        }
      }

      const handleOpenDocument = (file: string) => {
        window.open(file, '_blank')
      }

      const handleUploadDocument = (
        name: string,
        folderId: string | null,
      ) => {
        if (uploadingFile) {
          const reader = new FileReader()
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              const newDocument: Document = {
                id: String(Date.now()),
                name: name,
                file: reader.result,
                folderId: folderId,
                creationDate: new Date().toISOString(),
              }
              setDocuments([...documents, newDocument])
              handleOpenDocument(reader.result)
            }
          }
          reader.readAsDataURL(uploadingFile)
          setUploadingFile(null)
          setIsUploadModalOpen(false)
        }
      }

      const handleCloseUploadModal = () => {
        setIsUploadModalOpen(false)
        setUploadingFile(null)
      }

      const sortDocuments = (docs: Document[]): Document[] => {
        return [...docs].sort((a, b) => {
          if (sortOption === 'name') {
            return a.name.localeCompare(b.name)
          } else if (sortOption === 'date') {
            return (
              new Date(b.creationDate).getTime() -
              new Date(a.creationDate).getTime()
            )
          } else if (sortOption === 'type') {
            const typeA = a.name.split('.').pop() || ''
            const typeB = b.name.split('.').pop() || ''
            return typeA.localeCompare(typeB)
          }
          return 0
        })
      }

      const filteredDocuments = sortDocuments(
        documents
          .filter((doc) => doc.folderId === currentFolderId)
          .filter((doc) =>
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      )

      const filteredFolders = folders.filter((folder) =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      return (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Documents</h2>
            <div className="flex space-x-2">
              {selectedFoldersToDelete.length > 0 && (
                <button
                  onClick={handleDeleteSelectedFolders}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center mr-2"
                >
                  <Trash2 className="mr-2" />
                  Supprimer
                </button>
              )}
              <button
                onClick={handleAddFolder}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              >
                <FolderPlus className="mr-2" />
                Nouveau dossier
              </button>
              <button
                onClick={handleOpenFileDialog}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              >
                <Plus className="mr-2" />
                Nouveau document
              </button>
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-1/4">
              <h3 className="text-lg font-semibold mb-2">Dossiers</h3>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Rechercher un dossier..."
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="text-gray-500" />
                </div>
              </div>
              <ul className="space-y-2">
                {filteredFolders.map((folder) => (
                  <li
                    key={folder.id}
                    className={`bg-white shadow rounded p-2 flex items-center justify-between hover:bg-gray-100 ${
                      currentFolderId === folder.id ? 'bg-gray-200' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedFoldersToDelete.includes(folder.id)}
                        onChange={() => handleToggleSelectFolderToDelete(folder.id)}
                      />
                      <button
                        onClick={() => handleOpenFolder(folder.id)}
                        className="flex items-center w-full text-left"
                      >
                        <Folder className="mr-2" />
                        {folder.name}
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => handleEditFolder(folder)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleDeleteFolder(folder.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-3/4">
              <h3 className="text-lg font-semibold mb-2">
                {currentFolderId
                  ? 'Documents dans ce dossier'
                  : 'Liste des documents'}
              </h3>
              {currentFolderId && (
                <div className="mb-4 flex items-center">
                  <button
                    onClick={handleGoBack}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  >
                    Retour
                  </button>
                  <div className="relative flex-1 mr-2">
                    <input
                      type="text"
                      placeholder="Rechercher un document..."
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="text-gray-500" />
                    </div>
                  </div>
                  <div className="relative">
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
                          onClick={() => handleSortChange('name')}
                          className={`block w-full text-left py-2 px-4 hover:bg-gray-100 ${
                            sortOption === 'name' ? 'bg-gray-100' : ''
                          }`}
                        >
                          Nom
                        </button>
                        <button
                          onClick={() => handleSortChange('date')}
                          className={`block w-full text-left py-2 px-4 hover:bg-gray-100 ${
                            sortOption === 'date' ? 'bg-gray-100' : ''
                          }`}
                        >
                          Date de création
                        </button>
                        <button
                          onClick={() => handleSortChange('type')}
                          className={`block w-full text-left py-2 px-4 hover:bg-gray-100 ${
                            sortOption === 'type' ? 'bg-gray-100' : ''
                          }`}
                        >
                          Type de fichier
                        </button>
                      </div>
                    )}
                  </div>
                  {selectedDocumentsToDelete.length > 0 && (
                    <button
                      onClick={handleDeleteSelectedDocuments}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center ml-2"
                    >
                      <Trash2 className="mr-2" />
                      Supprimer
                    </button>
                  )}
                </div>
              )}
              {currentFolderId ? (
                <ul className="space-y-2">
                  {filteredDocuments.map((document) => (
                    <li
                      key={document.id}
                      className="bg-white shadow rounded p-2 flex items-center justify-between hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedDocumentsToDelete.includes(document.id)}
                          onChange={() =>
                            handleToggleSelectDocumentToDelete(document.id)
                          }
                        />
                        <button
                          onClick={() => handleOpenDocument(document.file)}
                          className="flex items-center text-left"
                        >
                          <File className="mr-2" />
                          {document.name}
                        </button>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {new Date(document.creationDate).toLocaleDateString()}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {document.name.split('.').pop()}
                      </span>
                      <div>
                        <button
                          onClick={() => handleEditDocument(document)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          <Edit />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(document.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
          {isDocumentModalOpen && (
            <DocumentModal
              isOpen={isDocumentModalOpen}
              onClose={handleCloseDocumentModal}
              onSave={handleSaveDocument}
              document={selectedDocument}
              folders={folders}
            />
          )}
          {isFolderModalOpen && (
            <FolderModal
              isOpen={isFolderModalOpen}
              onClose={handleCloseFolderModal}
              onSave={handleSaveFolder}
              folder={selectedFolder}
            />
          )}
          {isUploadModalOpen && (
            <UploadDocumentModal
              isOpen={isUploadModalOpen}
              onClose={handleCloseUploadModal}
              onUpload={handleUploadDocument}
              folders={folders}
            />
          )}
        </div>
      )
    }

    export default Documents
