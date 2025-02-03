import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Eye, Trash2, Download } from "lucide-react";
import { QuoteService } from "../services/api";
import { Quote } from "../types/database";
import QuoteForm from "../components/forms/QuoteForm";
import { pdfGenerator } from "../services/pdfGenerator";
import PDFViewer from "../components/PDFViewer";

const QuotesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isAddingQuote, setIsAddingQuote] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      const fetchedQuotes = await QuoteService.fetchAll();
      setQuotes(fetchedQuotes);
    };

    fetchQuotes();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const handleAddQuote = (newQuote: Partial<Quote>) => {
    const quoteToAdd = {
      ...newQuote,
      id: quotes.length + 1,
      creationDate: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      items: newQuote.items || [],
    } as Quote;

    setQuotes([...quotes, quoteToAdd]);
    setIsAddingQuote(false);
  };

  const handleDeleteQuote = (quoteId: number) => {
    setQuotes(quotes.filter((quote) => quote.id !== quoteId));
  };

  const getClientName = (clientId: number) => {
    // Vous devrez ajouter une fonction pour récupérer les clients depuis l'API backend
    // Par exemple, dans ClientService :
    // export const fetchAllClients = async (): Promise<Client[]> => {
    //   const response = await axios.get(`${API_BASE_URL}/clients`);
    //   return response.data;
    // };

    // Puis appeler cette fonction ici
    // const clients = await ClientService.fetchAllClients();
    // const client = clients.find((c) => c.id === clientId);
    // return client ? client.name : "Client inconnu";

    // Pour l'instant, nous utilisons des noms fictifs
    const mockClients = [
      { id: 1, name: "Client A" },
      { id: 2, name: "Client B" },
      { id: 3, name: "Client C" },
    ];
    const client = mockClients.find((c) => c.id === clientId);
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
            email: "",
          }}
          type="quote"
          onClose={() => setSelectedQuote(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Mes Devis</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsAddingQuote(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="mr-2" /> Nouveau Devis
          </button>
        </div>
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
                onClick={() => {
                  const clientName = getClientName(quote.clientId);
                  if (clientName) {
                    const client = {
                      id: quote.clientId,
                      name: clientName,
                      email: "",
                      phone: "",
                      address: "",
                      city: "",
                      postalCode: "",
                      country: "",
                    };
                    pdfGenerator.generateQuotePDF(quote, client);
                  }
                }}
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
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
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
