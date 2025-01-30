import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios"; // Importe axios

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

interface Quote {
  id: string;
  quoteNumber: string;
  creationDate: string;
  validUntil: string;
  clientId: string;
  items: QuoteItem[];
}

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

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quote: Quote) => void;
  quote: Quote | null;
  clients: Client[];
}

const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  quote,
  clients,
}) => {
  const [quoteNumber, setQuoteNumber] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState("heures");
  const [newItemUnitPrice, setNewItemUnitPrice] = useState(0);

  useEffect(() => {
    if (quote) {
      setQuoteNumber(quote.quoteNumber);
      setCreationDate(quote.creationDate);
      setValidUntil(quote.validUntil);
      setClientId(quote.clientId);
      setItems(quote.items);
    } else {
      setQuoteNumber(`DEV${String(Date.now()).slice(-4)}`);
      setCreationDate(new Date().toISOString().split("T")[0]);
      setValidUntil("");
      setClientId("");
      setItems([]);
    }
  }, [quote]);

  const handleAddItem = () => {
    const newItem: QuoteItem = {
      id: String(Date.now()),
      description: newItemDescription,
      quantity: newItemQuantity,
      unit: newItemUnit,
      unitPrice: newItemUnitPrice,
    };
    setItems([...items, newItem]);
    setNewItemDescription("");
    setNewItemQuantity(1);
    setNewItemUnit("heures");
    setNewItemUnitPrice(0);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Ajout de async
    e.preventDefault();
    const newQuote = {
      quoteNumber,
      creationDate,
      validUntil,
      clientId,
      items,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/quotes",
        newQuote
      ); // Envoie les données au serveur
      if (response.status === 201) {
        onSave({ ...newQuote, id: response.data.id }); // Met à jour l'état avec l'ID du nouveau devis
      } else {
        console.error("Erreur lors de l'ajout du devis :", response);
        alert("Erreur lors de l'ajout du devis.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du devis :", error);
      alert("Erreur lors de l'ajout du devis.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {quote ? "Modifier le devis" : "Nouveau devis"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="quoteNumber"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Numéro de devis
              </label>
              <input
                type="text"
                id="quoteNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={quoteNumber}
                onChange={(e) => setQuoteNumber(e.target.value)}
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="creationDate"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Date de création
              </label>
              <input
                type="date"
                id="creationDate"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={creationDate}
                onChange={(e) => setCreationDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="validUntil"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Valide jusqu'au
              </label>
              <input
                type="date"
                id="validUntil"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="clientId"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Client
              </label>
              <select
                id="clientId"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-4">
            Détail des prestations / produits
          </h3>
          <div className="mb-4">
            <div className="grid grid-cols-5 gap-2 mb-2">
              <input
                type="text"
                placeholder="Description"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
              />
              <input
                type="number"
                placeholder="Quantité"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(Number(e.target.value))}
              />
              <select
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
              >
                <option value="heures">heures</option>
                <option value="jours">jours</option>
                <option value="pièces">pièces</option>
              </select>
              <input
                type="number"
                placeholder="Prix unitaire HT"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newItemUnitPrice}
                onChange={(e) => setNewItemUnitPrice(Number(e.target.value))}
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Ajouter
              </button>
            </div>
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="bg-white shadow rounded p-2 flex items-center justify-between"
                >
                  <span>
                    {item.description} - {item.quantity} {item.unit} -{" "}
                    {item.unitPrice}€ HT
                  </span>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {quote ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteModal;
