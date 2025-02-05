import React, { useState, useEffect } from "react";
import {
  File,
  Folder as FolderIcon,
  Plus,
  Trash2,
  Download,
  Search,
  Edit,
  Save,
  X,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { DocumentService } from "../services/api";
import { Document, Folder } from "../types/database";
import DocumentForm from "../components/forms/DocumentForm";
import PDFViewer from "../components/PDFViewer";

// Fonction utilitaire pour vérifier le type de document
const isDocument = (item: any): item is Document => {
  return item && "pdfUrl" in item && "folderId" in item;
};

// Composant de liste des dossiers
const FolderList: React.FC<{
  folders: Folder[];
  selectedFolder: number | null;
  setSelectedFolder: (folderId: number | null) => void;
  documents: Document[];
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: number) => void;
}> = ({
  folders,
  selectedFolder,
  setSelectedFolder,
  documents,
  onCreateFolder,
  onDeleteFolder,
}) => {
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName("");
      setIsAddingFolder(false);
    }
  };

  return (
    <div className="w-64 bg-white/10 rounded-xl p-4 mr-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Dossiers</h2>
        <button
          onClick={() => setIsAddingFolder(true)}
          className="text-white hover:text-blue-400"
        >
          <Plus />
        </button>
      </div>

      {isAddingFolder && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex"
        >
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Nom du dossier"
            className="flex-grow bg-white/10 text-white border border-white/20 rounded-lg px-2 py-1 mr-2"
          />
          <button
            onClick={handleCreateFolder}
            className="bg-blue-600 text-white p-1 rounded"
          >
            <Save size={20} />
          </button>
          <button
            onClick={() => setIsAddingFolder(false)}
            className="bg-red-600 text-white p-1 rounded ml-1"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}

      <div className="space-y-2">
        <button
          onClick={() => setSelectedFolder(null)}
          className={`w-full text-left p-2 rounded-lg flex justify-between items-center 
          ${
            selectedFolder === null
              ? "bg-blue-600 text-white"
              : "hover:bg-white/10"
          }`}
        >
          <FolderIcon className="mr-2" /> Tous les documents
          <span className="text-sm text-white/70">{documents.length}</span>
        </button>

        {folders.map((folder) => (
          <div key={folder.id} className="flex justify-between items-center">
            <button
              onClick={() => setSelectedFolder(folder.id)}
              className={`flex-grow text-left p-2 rounded-lg flex justify-between items-center 
              ${
                selectedFolder === folder.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-white/10"
              }`}
            >
              <div className="flex items-center">
                <FolderIcon className="mr-2" />
                <span>{folder.name}</span>
              </div>
              <span className="text-sm text-white/70">
                {documents.filter((doc) => doc.folderId === folder.id).length}
              </span>
            </button>
            <button
              onClick={() => onDeleteFolder(folder.id)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDocumentsAndFolders = async () => {
      try {
        const [fetchedDocuments, fetchedFolders] = await Promise.all([
          DocumentService.fetchAll(),
          DocumentService.fetchFolders(),
        ]);
        setDocuments(fetchedDocuments);
        setFolders(fetchedFolders);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des documents et dossiers",
          error
        );
      }
    };
    fetchDocumentsAndFolders();
  }, []);

  const handleCreateFolder = async (name: string) => {
    try {
      const newFolder = await DocumentService.createFolder({ name });
      setFolders([...folders, newFolder]);
    } catch (error) {
      console.error("Erreur lors de la création du dossier", error);
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    try {
      await DocumentService.deleteFolder(folderId);
      setFolders(folders.filter((folder) => folder.id !== folderId));
      setDocuments(documents.filter((doc) => doc.folderId !== folderId));
    } catch (error) {
      console.error("Erreur lors de la suppression du dossier", error);
    }
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedFolder === null || doc.folderId === selectedFolder)
  );

  return (
    <div className="p-6 bg-white/5 rounded-xl flex">
      <FolderList
        folders={folders}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        documents={documents}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
      />

      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            {selectedFolder
              ? folders.find((f) => f.id === selectedFolder)?.name
              : "Tous les Documents"}
          </h1>
          <div className="flex space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 pl-10"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </div>
            <input
              type="file"
              id="document-upload"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  DocumentService.upload(file, selectedFolder || undefined)
                    .then((newDoc) => setDocuments([...documents, newDoc]))
                    .catch((error) =>
                      console.error("Erreur lors de l'upload", error)
                    );
                }
              }}
            />
            <label
              htmlFor="document-upload"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer"
            >
              <Plus className="mr-2" /> Ajouter
            </label>
          </div>
        </div>

        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <motion.div
              key={doc.id}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex justify-between items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center flex-grow">
                <File className="mr-4 text-blue-400" />
                <div className="flex-grow">
                  <h3 className="text-white font-bold">{doc.name}</h3>
                  <p className="text-white/70 text-sm">
                    Ajouté le {doc.uploadDate?.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => DocumentService.download(doc)}
                  className="text-white hover:text-blue-400"
                >
                  <Download />
                </button>
                <button
                  onClick={() => setSelectedDocument(doc)}
                  className="text-white hover:text-blue-400"
                >
                  <Eye />
                </button>
                <button
                  onClick={() => DocumentService.delete(doc.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Affichage conditionnel du PDFViewer */}
      {selectedDocument && isDocument(selectedDocument) && (
        <PDFViewer
          document={selectedDocument}
          client={{
            id: 0,
            name: "Nom du client", // Remplacez par les données réelles
            email: "client@example.com",
          }}
          type="document"
          company={{
            companyName: "Nom de l'entreprise",
            address: "Adresse de l'entreprise",
            email: "email@entreprise.com",
            siretNumber: "123456789",
            postalCode: "75001",
            city: "Paris",
            phone: "0123456789",
            id: 1,
          }}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default DocumentsPage;
