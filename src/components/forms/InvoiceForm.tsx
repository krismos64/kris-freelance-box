import React, { useState } from "react";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { Invoice } from "../../types/database";
import { InvoiceService } from "../../services/api";

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit: (invoice: Partial<Invoice>) => void;
  onCancel: () => void;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Invoice>>({
    invoiceNumber:
      invoice?.invoiceNumber ||
      `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
    creationDate:
      invoice?.creationDate || new Date().toISOString().split("T")[0],
    dueDate:
      invoice?.dueDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    clientId: invoice?.clientId || undefined,
    total: invoice?.total || 0,
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items?.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })) || []
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "clientId" ? Number(value) : value,
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string
  ) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]:
        field === "quantity"
          ? value === ""
            ? 0
            : parseInt(value, 10)
          : value === ""
          ? 0
          : parseFloat(value),
    };
    setItems(newItems);

    const total = newItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    setFormData((prev) => ({ ...prev, total }));
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);

    const total = newItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    setFormData((prev) => ({ ...prev, total }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (invoice) {
        const updatedInvoice = await InvoiceService.update(invoice.id, {
          ...formData,
          items: items,
        });
        if (updatedInvoice) {
          onSubmit(updatedInvoice);
        }
      } else {
        const newInvoice = await InvoiceService.create({
          ...formData,
          items: items,
        });
        if (newInvoice) {
          onSubmit(newInvoice);
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
          <label className="block text-white mb-2">Numéro de Facture</label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber || ""}
            onChange={handleChange}
            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Client</label>
          <select
            name="clientId"
            value={formData.clientId || ""}
            onChange={handleChange}
            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
          >
            <option value="">Sélectionner un client</option>
            {mockClients.map((client) => (
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
            value={formData.creationDate || ""}
            onChange={handleChange}
            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Date d'Échéance</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate || ""}
            onChange={handleChange}
            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-white">Lignes de Facture</h3>
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
              className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder="Quantité"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder="Prix Unitaire"
              value={item.unitPrice}
              onChange={(e) =>
                handleItemChange(index, "unitPrice", e.target.value)
              }
              className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
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
        Total : {formData.total?.toFixed(2) || "0.00"} €
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

export default InvoiceForm;
