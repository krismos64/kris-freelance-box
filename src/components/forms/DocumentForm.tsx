import React, { useState } from "react";
import { Save, X } from "lucide-react";
import { DocumentService } from "../../services/api";
import { Folder, Document, DocumentType } from "../../types/database";

interface DocumentFormProps {
  onSubmit: (document: Partial<Document>) => void;
  onCancel: () => void;
  folders: Folder[]; // Utilisation de dossiers réels
}

const DocumentForm: React.FC<DocumentFormProps> = ({
  onSubmit,
  onCancel,
  folders,
}) => {
  const [formData, setFormData] = useState<Partial<Document>>({
    folderId: folders[0]?.id || 0,
    type: "document" as DocumentType,
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation basique du fichier
      if (file.size > 5 * 1024 * 1024) {
        // Limite de 5 Mo
        setError("Le fichier est trop volumineux (max. 5 Mo).");
        return;
      }
      setFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Veuillez sélectionner un fichier.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await DocumentService.upload(
        file,
        formData.folderId as number
      );
      if (response) {
        onSubmit(response);
        setSuccessMessage("Document téléchargé avec succès.");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
      onCancel();
    } catch (error) {
      console.error("Erreur lors de l'upload du document", error);
      setError("Une erreur est survenue lors du téléchargement du document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 space-y-4"
      aria-live="polite"
    >
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-2">Dossier</label>
          <select
            name="folderId"
            value={formData.folderId || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            {folders.map((folder: Folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white mb-2">Type de Document</label>
          <select
            name="type"
            value={formData.type || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            <option value="document">Document</option>
            <option value="invoice">Facture</option>
            <option value="quote">Devis</option>
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
          disabled={isSubmitting || !file}
        >
          <Save className="mr-2" />{" "}
          {isSubmitting ? "En cours..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;
