import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from "../types/database";
import { ClientService } from "../services/api";
import { Edit, Trash2, Upload, Save, ArrowLeft } from "lucide-react";

const ClientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [client, setClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Partial<Client>>({});
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchClient = async () => {
      if (id) {
        try {
          const fetchedClient = await ClientService.fetchById(Number(id));
          setClient(fetchedClient);
          setEditedClient(fetchedClient || {});
          setImagePreview(fetchedClient?.imageUrl);
        } catch (error) {
          console.error(
            "Erreur lors de la r\u00e9cup\u00e9ration du client",
            error
          );
        }
      }
    };
    fetchClient();
  }, [id]);

  if (!client) return <div>Client non trouv\u00e9</div>;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setEditedClient((prev) => ({
          ...prev,
          imageUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (editedClient && id) {
      try {
        const updatedClient = await ClientService.update(
          Number(id),
          editedClient
        );
        if (updatedClient) {
          setClient(updatedClient);
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Erreur lors de la mise \u00e0 jour du client", error);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedClient((prev: Partial<Client>) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 bg-white/5 rounded-xl text-white">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/clients")}
          className="mr-4 hover:bg-white/10 p-2 rounded-full"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-3xl font-bold text-white">
          D\u00e9tails du Client
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white/10 rounded-xl p-6">
          <div className="relative mb-6">
            <img
              src={imagePreview || "https://via.placeholder.com/150"}
              alt="Client"
              className="w-40 h-40 rounded-full object-cover mx-auto mb-4"
            />
            {isEditing && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-1/4 bg-blue-600 text-white p-2 rounded-full"
                >
                  <Upload size={20} />
                </button>
              </>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editedClient.name || ""}
                onChange={handleChange}
                name="name"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
              />
              <input
                type="email"
                value={editedClient.email || ""}
                onChange={handleChange}
                name="email"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
              />
              <input
                type="tel"
                value={editedClient.phone || ""}
                onChange={handleChange}
                name="phone"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
              />
              <textarea
                value={editedClient.comments || ""}
                onChange={handleChange}
                name="comments"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
                placeholder="Commentaires"
              />
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <p className="text-gray-400">{client.email}</p>
              <p className="text-gray-400">{client.phone}</p>
              <p className="mt-4 text-sm">{client.comments}</p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Save className="mr-2" /> Enregistrer
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Edit className="mr-2" /> Modifier
              </button>
            )}
            <button
              onClick={() =>
                ClientService.delete(client.id).then(() => navigate("/clients"))
              }
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Trash2 className="mr-2" /> Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;
