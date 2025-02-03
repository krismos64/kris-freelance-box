import React, { useState, useEffect } from "react";
import { Save, X, Plus, Trash2, Search, CreditCard, Eye } from "lucide-react";
import { PaymentService } from "../services/api";
import { Payment, Invoice, Client } from "../types/database";

interface PaymentStatusBadgeProps {
  status: string;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "payé":
        return "bg-green-500";
      case "partiel":
        return "bg-yellow-500";
      case "en attente":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <span
      className={`ml-3 px-2 py-1 rounded-full text-xs ${getStatusColor()} text-white`}
    >
      {status}
    </span>
  );
};
import PaymentForm from "../components/forms/PaymentForm";
import { mockPayments, mockInvoices, mockClients } from "../mocks/mockData";

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    paymentMethod: "virement",
    status: "en attente",
  });
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      const fetchedPayments = await PaymentService.fetchAll();
      setPayments(fetchedPayments);
    };

    fetchPayments();
  }, []);

  const handleAddPayment = () => {
    setIsAddingPayment(true);
  };

  const handleSavePayment = async () => {
    if (newPayment.invoiceId && newPayment.amount) {
      const paymentToAdd: Payment = {
        ...newPayment,
        id: payments.length + 1,
        paymentDate: new Date().toISOString().split("T")[0],
      } as Payment;

      setPayments([...payments, paymentToAdd]);
      setIsAddingPayment(false);
    }
  };

  const handleDeletePayment = (paymentId: number) => {
    setPayments(payments.filter((p) => p.id !== paymentId));
  };

  return (
    <div className="p-6 bg-white/5 rounded-xl flex">
      {/* Sidebar Dossiers */}
      <div className="w-64 bg-white/10 rounded-xl p-4 mr-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Paiements</h2>
          <button
            onClick={handleAddPayment}
            className="text-white hover:text-blue-400"
          >
            <Plus />
          </button>
        </div>
      </div>

      {/* Liste des Documents */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Suivi des Paiements</h1>
          <div className="flex space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Rechercher un paiement..."
                value={""}
                onChange={() => {}}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 pl-10"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </div>
            <select
              value={""}
              onChange={() => {}}
              className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
            >
              <option value="">Tous les statuts</option>
              <option value="payé">Payé</option>
              <option value="partiel">Partiel</option>
              <option value="en attente">En Attente</option>
            </select>
          </div>
        </div>

        {/* Formulaire d'ajout de paiement */}
        {isAddingPayment && (
          <div className="mb-6">
            <PaymentForm
              onSubmit={handleSavePayment}
              onCancel={() => setIsAddingPayment(false)}
            />
          </div>
        )}

        {/* Liste des Paiements */}
        <div className="space-y-4">
          {payments.map((payment) => {
            const invoice = mockInvoices.find(
              (inv) => inv.id === payment.invoiceId
            );
            const client = invoice
              ? mockClients.find((c) => c.id === invoice.clientId)
              : null;

            return (
              <div
                key={payment.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center mb-2">
                    <CreditCard className="mr-3 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">
                      {invoice?.invoiceNumber}
                    </h3>
                    <PaymentStatusBadge status={payment.status} />
                  </div>
                  <p className="text-white/70">Client: {client?.name}</p>
                  <p className="text-white/70">
                    Référence: {payment.reference || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">
                    {payment.amount}€
                  </p>
                  <p className="text-white/70">
                    Payé le {new Date(payment.paymentDate).toLocaleDateString()}
                  </p>
                  <p className="text-white/70">
                    {payment.paymentMethod.charAt(0).toUpperCase() +
                      payment.paymentMethod.slice(1)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedPayment(payment)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <Eye />
                  </button>
                  <button
                    onClick={() => handleDeletePayment(payment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
