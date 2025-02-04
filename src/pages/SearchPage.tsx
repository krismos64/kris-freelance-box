import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  ClientService,
  InvoiceService,
  QuoteService,
  TaskService,
  DocumentService,
} from "../services/api";
import { Client, Invoice, Quote, Task, Document } from "../types/database";

interface SearchResult {
  type: "client" | "invoice" | "quote" | "task" | "document";
  id: number;
  title: string;
  description?: string;
  icon: string;
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const [clients, invoices, quotes, tasks, documents] = await Promise.all(
          [
            ClientService.search(searchTerm),
            InvoiceService.search(searchTerm),
            QuoteService.search(searchTerm),
            TaskService.search(searchTerm),
            DocumentService.search(searchTerm),
          ]
        );

        const searchResults: SearchResult[] = [
          // Clients
          ...clients.map((client) => ({
            type: "client" as const,
            id: client.id,
            title: client.name,
            description: client.email,
            icon: "👥",
          })),

          // Invoices
          ...invoices.map((invoice) => ({
            type: "invoice" as const,
            id: invoice.id,
            title: invoice.invoiceNumber,
            description: `Total: ${invoice.total}€`,
            icon: "📄",
          })),

          // Quotes
          ...quotes.map((quote) => ({
            type: "quote" as const,
            id: quote.id,
            title: quote.quoteNumber,
            description: `Total: ${quote.total}€`,
            icon: "📋",
          })),

          // Tasks
          ...tasks.map((task) => ({
            type: "task" as const,
            id: task.id,
            title: task.name,
            description: task.description,
            icon: "✅",
          })),

          // Documents
          ...documents.map((doc) => ({
            type: "document" as const,
            id: doc.id,
            title: doc.name,
            description: `Type: ${doc.type}`,
            icon: "📁",
          })),
        ];

        setResults(searchResults);
      } catch (error) {
        console.error("Erreur lors de la recherche", error);
      }
    };

    fetchResults();
  }, [searchTerm]);

  const getResultLink = (result: SearchResult) => {
    const links = {
      client: `/clients/${result.id}`,
      invoice: `/invoices/${result.id}`,
      quote: `/quotes/${result.id}`,
      task: `/tasks/${result.id}`,
      document: `/documents/${result.id}`,
    };
    return links[result.type];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0f172a] z-[1000] flex flex-col"
    >
      <div className="p-6 border-b border-white/10 bg-[#334155]">
        <div className="max-w-4xl mx-auto flex items-center">
          <Search className="w-6 h-6 text-white/70 mr-4" />
          <input
            type="text"
            placeholder="Rechercher dans FreelanceBox..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-white text-xl border-none outline-none placeholder-white/50"
            autoFocus
          />
          <Link to="/" className="text-white/70 hover:text-white">
            <X className="w-6 h-6" />
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full p-6">
        {results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 hover:bg-white/20 transition-all"
              >
                <Link to={getResultLink(result)} className="block">
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-4">{result.icon}</span>
                    <h3 className="text-lg font-bold text-white">
                      {result.title}
                    </h3>
                  </div>
                  {result.description && (
                    <p className="text-white/70 text-sm">
                      {result.description}
                    </p>
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-white/70 mt-20">
            {searchTerm
              ? "Aucun résultat trouvé"
              : "Commencez à taper pour rechercher"}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchPage;
