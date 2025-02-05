import React, { useState } from "react";
import { Save, X } from "lucide-react";
import { PaymentService } from "../../services/api";
import { Payment, Invoice } from "../../types/database";

interface PaymentFormProps {
  onSubmit: (payment: Partial<Payment>) => void;
  onCancel: () => void;
  invoices: Invoice[];
}
const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  onCancel,
  invoices,
}) => {
  const [formData, setFormData] = useState<Partial<Payment>>({
    paymentMethod: "virement",
    status: "en attente",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<Payment>) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-2">Facture</label>
          <select
            name="invoiceId"
            value={formData.invoiceId || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            {invoices.map((invoice: Invoice) => (
              <option key={invoice.id} value={invoice.id}>
                {invoice.invoiceNumber} - {invoice.total}€
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white mb-2">Montant</label>
          <input
            type="number"
            name="amount"
            value={formData.amount || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Date de Paiement</label>
          <input
            type="date"
            name="paymentDate"
            value={
              formData.paymentDate instanceof Date
                ? formData.paymentDate.toISOString().split("T")[0]
                : formData.paymentDate || ""
            }
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Méthode de Paiement</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            <option value="virement">Virement</option>
            <option value="chèque">Chèque</option>
            <option value="espèces">Espèces</option>
            <option value="carte">Carte</option>
          </select>
        </div>
        <div>
          <label className="block text-white mb-2">Statut</label>
          <select
            name="status"
            value={formData.status || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            <option value="en attente">En Attente</option>
            <option value="partiel">Partiel</option>
            <option value="payé">Payé</option>
          </select>
        </div>
        <div>
          <label className="block text-white mb-2">Référence</label>
          <input
            type="text"
            name="reference"
            value={formData.reference || ""}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
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

export default PaymentForm;
