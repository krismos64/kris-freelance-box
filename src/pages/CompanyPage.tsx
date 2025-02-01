import React, { useState, useEffect } from "react";
import { Save, Edit, Upload } from "lucide-react";
import { CompanyService } from "../services/api";
import { Company } from "../types/database";

const CompanyPage: React.FC = () => {
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState(companyData?.logoUrl || "");

  useEffect(() => {
    const fetchCompany = async () => {
      const company = await CompanyService.fetchCompany();
      if (company) {
        setCompanyData(company);
        setLogoPreview(company.logoUrl || "");
      }
    };

    fetchCompany();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (companyData) {
      const success = await CompanyService.updateCompany(companyData);
      if (success) {
        console.log("Entreprise mise à jour avec succès");
      } else {
        console.error("Erreur lors de la mise à jour de l'entreprise");
      }
    }
    setIsEditing(false);
  };

  if (!companyData) return <div>Chargement...</div>;

  return (
    <div className="p-6 bg-white/5 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Informations de l'Entreprise
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          {isEditing ? (
            "Annuler"
          ) : (
            <>
              <Edit className="mr-2" /> Modifier
            </>
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Informations Générales */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <div className="relative mb-6 flex justify-center">
            <img
              src={logoPreview || "https://via.placeholder.com/150"}
              alt="Logo de l'entreprise"
              className="w-40 h-40 rounded-full object-cover"
            />
            {isEditing && (
              <div className="absolute bottom-0 right-1/4">
                <input
                  type="file"
                  id="logo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <label
                  htmlFor="logo-upload"
                  className="bg-blue-600 text-white p-2 rounded-full cursor-pointer"
                >
                  <Upload size={20} />
                </label>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">
                  Nom de l'Entreprise
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={companyData.companyName}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Numéro SIRET</label>
                <input
                  type="text"
                  name="siretNumber"
                  value={companyData.siretNumber}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2">
                  Secteur d'Activité
                </label>
                <input
                  type="text"
                  name="businessSector"
                  value={companyData.businessSector || ""}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2">
                  Date de Création
                </label>
                <input
                  type="date"
                  name="foundedDate"
                  value={companyData.foundedDate || ""}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">
                {companyData.companyName}
              </h2>
              <p className="text-white/70">{companyData.businessSector}</p>
              <p className="text-white/70">
                Créée le{" "}
                {new Date(companyData.foundedDate || "").toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Coordonnées */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Coordonnées</h3>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={companyData.address}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Code Postal</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={companyData.postalCode}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Ville</label>
                  <input
                    type="text"
                    name="city"
                    value={companyData.city}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={companyData.email}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={companyData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-white/80">
              <p>{companyData.address}</p>
              <p>
                {companyData.postalCode} {companyData.city}
              </p>
              <p>{companyData.email}</p>
              <p>{companyData.phone}</p>
            </div>
          )}

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Save className="mr-2" /> Enregistrer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
