import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from "../types/database";
import { ClientService } from "../services/api";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import ClientForm from "../components/forms/ClientForm";

const ClientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchClient = async () => {
      if (id) {
        try {
          const fetchedClient = await ClientService.fetchById(Number(id));
          setClient(fetchedClient);
        } catch (error) {
          console.error("Erreur lors de la récupération du client", error);
        }
      }
    };
    fetchClient();
  }, [id]);

  const handleUpdate = async (updatedClient: Partial<Client>) => {
    setClient(updatedClient as Client);
    setIsEditing(false);
    setSuccessMessage("Client mis à jour avec succès.");
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        if (client) {
          await ClientService.delete(client.id);
          navigate("/clients");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du client", error);
      }
    }
  };

  if (!client) return <div>Client non trouvé</div>;

  return (
    <div className="p-6 bg-white/5 rounded-xl text-white">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/clients")}
          className="mr-4 hover:bg-white/10 p-2 rounded-full"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-3xl font-bold text-white">Détails du Client</h1>
      </div>

      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white/10 rounded-xl p-6">
          {isEditing ? (
            <ClientForm
              client={client}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="text-center">
              {/* Affichage de l'image du client */}
              <div className="relative mb-6">
                <img
                  src={`http://localhost:5002${client.imageUrl}`}
                  alt={client.name}
                  onError={(e) => {
                    console.error(
                      "Erreur de chargement de l'image :",
                      client.imageUrl
                    );
                    (e.target as HTMLImageElement).src =
                      "/images/default-placeholder.jpg";
                  }}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>

              <h2 className="text-2xl font-bold">{client.name}</h2>
              <p className="text-gray-400">{client.email}</p>
              <p className="text-gray-400">{client.phone}</p>
              <p className="text-gray-400">
                {client.address}, {client.postalCode} {client.city}
              </p>
              <p className="mt-4 text-sm">{client.comments}</p>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Edit className="mr-2" /> Modifier
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Trash2 className="mr-2" /> Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;
