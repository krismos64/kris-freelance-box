import React, { useState, useEffect } from "react";
import { Save, Edit, Upload } from "lucide-react";
import { CompanyService } from "../services/api";
import { Company } from "../types/database";
import CompanyForm from "../components/forms/CompanyForm";

const CompanyPage: React.FC = () => {
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyId = 1; // Remplace par l'ID de l'entreprise si nécessaire
        const company = await CompanyService.fetchCompanyInfo(companyId);
        if (company) {
          setCompanyData(company);
          setLogoPreview(company.logoUrl || "/images/default-placeholder.jpg");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            "Erreur lors de la récupération des informations :",
            error.message
          );
        } else {
          console.error(
            "Erreur inconnue lors de la récupération des informations :",
            error
          );
        }
        setErrorMessage(
          "Une erreur est survenue lors de la récupération des données."
        );
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

  const handleSave = async (companyData: Partial<Company>) => {
    if (!companyData.id) {
      console.log(
        "Données de l'entreprise avant la mise à jour :",
        companyData
      );
      console.error("⚠️ Impossible de mettre à jour : ID manquant !");
      setErrorMessage("ID de l'entreprise manquant.");
      return;
    }

    const formData = new FormData();
    Object.entries(companyData).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value.toString());
      }
    });

    formData.forEach((value, key) => {
      console.log(`Données envoyées à l'API : ${key} = ${value}`);
    });

    try {
      await CompanyService.updateCompanyInfo(formData, companyData.id);
      console.log("Entreprise mise à jour avec succès !");
      setIsEditing(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de la mise à jour :", error.message);
        setErrorMessage(
          "Une erreur est survenue lors de la mise à jour des données."
        );
      } else {
        console.error("Erreur inconnue :", error);
      }
    }
  };

  if (!companyData) return <div>Chargement...</div>;

  return (
    <div className="p-6 bg-white/5 rounded-xl flex">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Informations de l'Entreprise
          </h2>
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

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {isEditing ? (
          <CompanyForm
            company={companyData}
            onSubmit={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="relative mb-6 flex justify-center">
                <img
                  src={logoPreview}
                  alt="Logo de l'entreprise"
                  onError={(e) => {
                    console.error(
                      "Erreur de chargement de l'image :",
                      logoPreview
                    );
                    (e.target as HTMLImageElement).src =
                      "/images/default-placeholder.jpg";
                  }}
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
                  <p className="text-white/80">{companyData.name}</p>
                </div>
                <div>
                  <label className="block text-white mb-2">Numéro SIRET</label>
                  <p className="text-white/80">
                    {companyData.registrationNumber}
                  </p>
                </div>
              </div>
            </div>

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
