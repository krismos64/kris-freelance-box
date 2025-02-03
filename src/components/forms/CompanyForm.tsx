import React, { useState } from "react";
import { Save, X } from "lucide-react";
import { CompanyService } from "../../services/api";
import { Company } from "../../types/database";

interface CompanyFormProps {
  company: Company;
  onSubmit: (company: Partial<Company>) => void;
  onCancel: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Company>>(company);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<Company>) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-2">Nom de l'Entreprise</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Numéro SIRET</label>
          <input
            type="text"
            name="siretNumber"
            value={formData.siretNumber || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Adresse</label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Code Postal</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Ville</label>
          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Identifiant Fiscal</label>
          <input
            type="text"
            name="taxIdentification"
            value={formData.taxIdentification || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Secteur d'Activité</label>
          <input
            type="text"
            name="businessSector"
            value={formData.businessSector || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Date de Création</label>
          <input
            type="date"
            name="foundedDate"
            value={formData.foundedDate || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
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

export default CompanyForm;
