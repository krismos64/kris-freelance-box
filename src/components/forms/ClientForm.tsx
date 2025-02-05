import React, { useState } from "react";
import { Save, X } from "lucide-react";
import { Client } from "../../types/database";
import { ClientService } from "../../services/api";

interface ClientFormProps {
  client?: Client;
  onSubmit: (client: Partial<Client>) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    address: client?.address || "",
    postalCode: client?.postalCode || "",
    city: client?.city || "",
    comments: client?.comments || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      setErrorMessage("Le nom est obligatoire.");
      return;
    }

    try {
      const clientData = new FormData();

      // Convertir les champs texte en FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          clientData.append(key, value.toString());
        }
      });

      // Ajouter l'image au FormData
      if (imageFile) {
        clientData.append("image", imageFile);
      }

      let newClient;
      if (client) {
        newClient = await ClientService.update(client.id, clientData);
      } else {
        newClient = await ClientService.create(clientData);
      }

      if (newClient) {
        onSubmit(newClient);
        setSuccessMessage("Client enregistré avec succès.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          postalCode: "",
          city: "",
          comments: "",
        });
        setImageFile(null);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      setErrorMessage(
        "Une erreur s'est produite lors de l'enregistrement du client."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 space-y-4"
    >
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-2">Nom *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Adresse</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Code Postal</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Ville</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="w-full text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-white mb-2">Commentaires</label>
        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white h-24"
        />
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

export default ClientForm;
