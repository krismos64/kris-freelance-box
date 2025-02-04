import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Eye, Trash2, Download } from "lucide-react";
import { QuoteService, ClientService } from "../services/api";
import { Quote, Client } from "../types/database";
import QuoteForm from "../components/forms/QuoteForm";
import { pdfGenerator } from "../services/pdfGenerator";
import PDFViewer from "../components/PDFViewer";

const QuotesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isAddingQuote, setIsAddingQuote] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedQuotes, fetchedClients] = await Promise.all([
          QuoteService.fetchAll(),
          ClientService.fetchAll(),
        ]);
        setQuotes(fetchedQuotes);
        setClients(fetchedClients);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddQuote = async (newQuote: Partial<Quote>) => {
    try {
      const createdQuote = await QuoteService.create(newQuote);
      setQuotes([...quotes, createdQuote]);
      setIsAddingQuote(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du devis", error);
    }
  };

  const handleDeleteQuote = async (quoteId: number) => {
    try {
      await QuoteService.delete(quoteId);
      setQuotes(quotes.filter((quote) => quote.id !== quoteId));
    } catch (error) {
      console.error("Erreur lors de la suppression du devis", error);
    }
  };

  const getClientName = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : "Client inconnu";
  };

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClientName(quote.clientId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white/5 rounded-xl">
      {selectedQuote && (
        <PDFViewer
          document={selectedQuote}
          client={{
            id: selectedQuote.clientId,
            name: getClientName(selectedQuote.clientId),
            email:
              clients.find((c) => c.id === selectedQuote.clientId)?.email || "",
          }}
          type="quote"
          onClose={() => setSelectedQuote(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Mes Devis</h1>
        <button
          onClick={() => setIsAddingQuote(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="mr-2" /> Nouveau Devis
        </button>
      </div>

      {isAddingQuote && (
        <div className="mb-6">
          <QuoteForm
            onSubmit={handleAddQuote}
            onCancel={() => setIsAddingQuote(false)}
          />
        </div>
      )}

      <div className="flex mb-6 space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Rechercher un devis..."
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

      <div className="space-y-4">
        {filteredQuotes.map((quote) => (
          <div
            key={quote.id}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold text-white">
                {quote.quoteNumber}
              </h3>
              <p className="text-gray-400">
                {getClientName(quote.clientId)} -{" "}
                {new Date(quote.creationDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-400 font-bold">{quote.total} €</span>
              <button
                onClick={() =>
                  pdfGenerator.generateQuotePDF(
                    quote,
                    clients.find((c) => c.id === quote.clientId) || {
                      id: 0,
                      name: "Client inconnu",
                      email: "",
                      phone: "",
                      address: "",
                      city: "",
                      postalCode: "",
                      creationDate: new Date(),
                    }
                  )
                }
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Download />
              </button>
              <button
                onClick={() => setSelectedQuote(quote)}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Eye />
              </button>
              <button
                onClick={() => handleDeleteQuote(quote.id)}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuotesPage;
