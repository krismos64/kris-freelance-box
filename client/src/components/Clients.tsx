import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import ClientModal from "./ClientModal";
import axios from "axios";

interface Client {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
  creationDate: string;
  imageUrl: string;
  comments: string;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients :", error);
      }
    };
    fetchClients();
  }, []);

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteClient = (id: string) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce client ?"
    );
    if (confirmDelete) {
      setClients(clients.filter((client) => client.id !== id));
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleSaveClient = (client: Client) => {
    if (isEditing && selectedClient) {
      setClients(clients.map((c) => (c.id === selectedClient.id ? client : c)));
    } else {
      setClients([...clients, client]);
    }
    setIsModalOpen(false);
  };

  const filteredClients = clients
    .filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Clients</h2>
        <button
          onClick={handleAddClient}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
        >
          <Plus className="mr-2" />
          Nouveau client
        </button>
      </div>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="text-gray-500" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b"></th>
              <th className="py-2 px-4 border-b">Nom</th>
              <th className="py-2 px-4 border-b">Ville</th>
              <th className="py-2 px-4 border-b">Téléphone</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">
                  {client.imageUrl && (
                    <img
                      src={client.imageUrl}
                      alt={`${client.name} logo`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="py-2 px-4 border-b">{client.name}</td>
                <td className="py-2 px-4 border-b">{client.city}</td>
                <td className="py-2 px-4 border-b">{client.phone}</td>
                <td className="py-2 px-4 border-b">{client.email}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditClient(client)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <ClientModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveClient}
          client={selectedClient}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default Clients;
