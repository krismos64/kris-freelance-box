import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Eye, Trash2 } from "lucide-react";
import { ClientService } from "../services/api";
import ClientForm from "../components/forms/ClientForm";
import { Client } from "../types/database";

const ClientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const fetchedClients = await ClientService.fetchAll();
        setClients(fetchedClients);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients", error);
        setErrorMessage("Impossible de charger la liste des clients.");
      }
    };
    fetchClients();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddClient = async (newClient: Partial<Client>) => {
    try {
      const clientToAdd = await ClientService.create(newClient);
      if (clientToAdd) {
        setClients([...clients, clientToAdd]);
        setSuccessMessage("Client ajouté avec succès.");
      }
      setIsAddingClient(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du client", error);
      setErrorMessage("Erreur lors de l'ajout du client.");
    }
  };

  const handleDeleteClient = async (clientId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await ClientService.delete(clientId);
        setClients(clients.filter((client) => client.id !== clientId));
        setSuccessMessage("Client supprimé avec succès.");
      } catch (error) {
        console.error("Erreur lors de la suppression du client", error);
        setErrorMessage("Erreur lors de la suppression du client.");
      }
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white/5 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Mes Clients</h1>
        <button
          onClick={() => setIsAddingClient(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="mr-2" /> Nouveau Client
        </button>
      </div>

      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {isAddingClient && (
        <div className="mb-6">
          <ClientForm
            onSubmit={handleAddClient}
            onCancel={() => setIsAddingClient(false)}
          />
        </div>
      )}

      <div className="flex mb-6 space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 pl-10"
          />
          <Search className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button className="bg-white/10 text-white px-4 py-2 rounded-lg flex items-center">
          <Filter className="mr-2" /> Filtres
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 transform transition-all hover:scale-105 relative"
          >
            <div className="flex items-center mb-4">
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

              <div>
                <h3 className="text-xl font-bold text-white">{client.name}</h3>
                <span className="text-sm text-blue-400">
                  Depuis{" "}
                  {new Date(client.creationDate || "").toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="space-y-2 text-gray-300">
              <p>
                📍 {client.address}, {client.postalCode} {client.city}
              </p>
              <p>✉️ {client.email}</p>
              <p>📞 {client.phone}</p>
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <Link
                to={`/clients/${client.id}`}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Eye size={20} />
              </Link>
              <button
                onClick={() => handleDeleteClient(client.id)}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsPage;
