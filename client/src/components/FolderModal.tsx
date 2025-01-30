import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios"; // Importe axios

interface Folder {
  id: string;
  name: string;
}

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (folder: Folder) => void;
  folder: Folder | null;
}

const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  folder,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (folder) {
      setName(folder.name);
    } else {
      setName("");
    }
  }, [folder]);

  const handleSubmit = async (e: React.FormEvent) => {
    // Ajout de async
    e.preventDefault();
    const newFolder = {
      name,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/folders",
        newFolder
      ); // Envoie les données au serveur
      if (response.status === 201) {
        onSave({ ...newFolder, id: response.data.id }); // Met à jour l'état avec l'ID du nouveau dossier
      } else {
        console.error("Erreur lors de l'ajout du dossier :", response);
        alert("Erreur lors de l'ajout du dossier.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du dossier :", error);
      alert("Erreur lors de l'ajout du dossier.");
    }
  };

  if (!isOpen) return null;

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
          {folder ? "Modifier le dossier" : "Nouveau dossier"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Nom du dossier
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
              {folder ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FolderModal;
