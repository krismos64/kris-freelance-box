import React, { useState, useEffect } from "react";
import { Save, Edit, Upload } from "lucide-react";
import { CompanyService } from "../services/api";
import { Company } from "../types/database";
import CompanyForm from "../components/forms/CompanyForm";

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
        setCompanyData((prev) => ({
          ...prev!,
          logoUrl: reader.result as string,
        }));
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
    <div className="p-6 bg-white/5 rounded-xl flex">
      {/* Visionneuse de document */}
      <div className="flex-1">
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

        {isEditing ? (
          <CompanyForm
            company={companyData}
            onSubmit={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Informations Générales */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="relative mb-6 flex justify-center">
                <img
                  src={logoPreview || "https://via.placeholder.com/150"}
                  alt="Logo de l'entreprise"
                  className="w-40 h-40 rounded-full object-cover"
                />
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
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">
                    Nom de l'Entreprise
                  </label>
                  <p className="text-white/80">{companyData.companyName}</p>
                </div>
                <div>
                  <label className="block text-white mb-2">Numéro SIRET</label>
                  <p className="text-white/80">{companyData.siretNumber}</p>
                </div>
                <div>
                  <label className="block text-white mb-2">
                    Secteur d'Activité
                  </label>
                  <p className="text-white/80">{companyData.businessSector}</p>
                </div>
                <div>
                  <label className="block text-white mb-2">
                    Date de Création
                  </label>
                  <p className="text-white/80">
                    {new Date(
                      companyData.foundedDate || ""
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Coordonnées */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Coordonnées</h3>
              <div className="space-y-2 text-white/80">
                <p>{companyData.address}</p>
                <p>
                  {companyData.postalCode} {companyData.city}
                </p>
                <p>{companyData.email}</p>
                <p>{companyData.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPage;
