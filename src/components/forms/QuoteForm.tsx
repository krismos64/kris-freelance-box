import React, { useState } from "react";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { Quote } from "../../types/database";
import { QuoteService } from "../../services/api";
import { Client } from "../../types/database";

interface QuoteFormProps {
  quote?: Quote;
  clients: Client[];
  onSubmit: (quote: Partial<Quote>) => void;
  onCancel: () => void;
}

interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
}
const QuoteForm: React.FC<QuoteFormProps> = ({
  quote,
  clients,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Quote>>({
    quoteNumber:
      quote?.quoteNumber ||
      `QUOTE-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
    creationDate: quote?.creationDate || new Date(),
    validUntil:
      quote?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    clientId: quote?.clientId || undefined,
  });

  const [items, setItems] = useState<QuoteItem[]>(() => {
    if (quote && quote.items) {
      return quote.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));
    }
    return [];
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof QuoteItem,
    value: string
  ) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === "quantity" ? parseInt(value) : parseFloat(value),
    };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (quote) {
        const updatedQuote = await QuoteService.update(quote.id, {
          ...formData,
          total: calculateTotal(),
          items: items,
        });
        if (updatedQuote) {
          onSubmit(updatedQuote);
        }
      } else {
        const newQuote = await QuoteService.create({
          ...formData,
          total: calculateTotal(),
          items: items,
        });
        if (newQuote) {
          onSubmit(newQuote);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-2">Numéro de Devis</label>
          <input
            type="text"
            name="quoteNumber"
            value={formData.quoteNumber}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Client</label>
          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white mb-2">Date de Création</label>
          <input
            type="date"
            name="creationDate"
            value={formData.creationDate?.toISOString().split("T")[0]}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Date de Validité</label>
          <input
            type="date"
            name="validUntil"
            value={formData.validUntil?.toISOString().split("T")[0]}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-white">Lignes de Devis</h3>
          <button
            type="button"
            onClick={addItem}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center"
          >
            <Plus className="mr-2" /> Ajouter
          </button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 mb-2">
            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleItemChange(index, "description", e.target.value)
              }
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            />
            <input
              type="number"
              placeholder="Quantité"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            />
            <input
              type="number"
              placeholder="Prix Unitaire"
              value={item.unitPrice}
              onChange={(e) =>
                handleItemChange(index, "unitPrice", e.target.value)
              }
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="bg-red-600 text-white px-3 py-2 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="text-right text-white text-xl font-bold">
        Total : {calculateTotal().toFixed(2)} €
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

export default QuoteForm;
