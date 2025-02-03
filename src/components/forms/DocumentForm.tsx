import React, { useState } from "react";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { DocumentService } from "../services/api";
import { Folder } from "../types/database";
import { mockFolders } from "../mocks/mockData";

interface DocumentFormProps {
  onSubmit: (document: Partial<Document>) => void;
  onCancel: () => void;
}

interface DocumentItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Document {
  id?: number;
  folderId: number;
  fileName?: string;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Document>>({
    folderId: mockFolders[0].id,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<Document>) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      const response = await DocumentService.uploadDocument(
        file,
        formData.folderId as number
      );
      if (response) {
        onSubmit(response);
      }
    }
    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-2">Dossier</label>
          <select
            name="folderId"
            value={formData.folderId || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            {mockFolders.map((folder: Folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white mb-2">Fichier</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            accept="application/pdf, image/*"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <X className="mr-2" /> Annuler
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Save className="mr-2" /> Enregistrer
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;
