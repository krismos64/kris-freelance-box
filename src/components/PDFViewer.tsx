import React, { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import jsPDF from "jspdf";
import type {
  Invoice,
  Quote,
  Client,
  Company,
  Document,
  DocumentType,
} from "../types/database";

interface PDFViewerProps {
  document: Document;
  client: Client;
  type: DocumentType;
  company: Company;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  document,
  client,
  type,
  company,
  onClose,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const isInvoice = (doc: Document | unknown): doc is Invoice => {
    const potentialInvoice = doc as Invoice;
    return (
      potentialInvoice.invoiceNumber !== undefined &&
      potentialInvoice.items !== undefined
    );
  };

  const isQuote = (doc: Document | unknown): doc is Quote => {
    const potentialQuote = doc as Quote;
    return (
      potentialQuote.quoteNumber !== undefined &&
      potentialQuote.items !== undefined
    );
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // En-tête de l'entreprise
    doc.setFontSize(10);
    doc.text(`Entreprise: ${company.companyName}`, 20, 20);
    doc.text(`Adresse: ${company.address}`, 20, 30);
    doc.text(`Email: ${company.email}`, 20, 40);

    // Titre du document
    doc.setFontSize(14);
    const title = isInvoice(document)
      ? `FACTURE N° ${document.invoiceNumber}`
      : isQuote(document)
      ? `DEVIS N° ${document.quoteNumber}`
      : "Document";
    doc.text(title, 20, 50);

    // Informations du client
    doc.setFontSize(10);
    doc.text(`Client: ${client.name}`, 20, 70);
    doc.text(`Email: ${client.email || "N/A"}`, 20, 80);

    // Détails du document
    const details = isInvoice(document)
      ? {
          date: new Date(document.issuedAt).toLocaleDateString(),
          dueDate: new Date(document.dueDate).toLocaleDateString(),
          label: "Échéance",
        }
      : isQuote(document)
      ? {
          date: new Date(document.issuedAt).toLocaleDateString(),
          dueDate: new Date(document.validUntil).toLocaleDateString(),
          label: "Valide jusqu'au",
        }
      : {
          date: new Date().toLocaleDateString(),
          dueDate: new Date().toLocaleDateString(),
          label: "Date",
        };

    doc.text(`Date: ${details.date}`, 20, 90);
    doc.text(`${details.label}: ${details.dueDate}`, 20, 100);

    // Lignes de document
    doc.setFontSize(12);
    doc.text("Détail des Prestations", 20, 120);

    let yPosition = 130;
    const items = isInvoice(document)
      ? document.items
      : isQuote(document)
      ? document.items
      : [];

    items?.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.description}`, 20, yPosition);
      doc.text(`Quantité: ${item.quantity}`, 120, yPosition);
      doc.text(`Prix: ${item.unitPrice.toFixed(2)} €`, 180, yPosition);
      yPosition += 10;
    });

    // Total du document
    doc.setFontSize(14);
    const total =
      items?.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) ||
      0;
    doc.text(`TOTAL: ${total.toFixed(2)} €`, 150, yPosition + 20);

    // Générer l'URL du PDF
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);
  };

  useEffect(() => {
    generatePDF();
  }, [document, client, type]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = window.document.createElement("a");
      link.href = pdfUrl;
      link.download = isInvoice(document)
        ? `Facture-${document.invoiceNumber}.pdf`
        : isQuote(document)
        ? `Devis-${document.quoteNumber}.pdf`
        : "Document.pdf";

      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-xl w-4/5 h-4/5 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <h2 className="text-xl text-white">
            {isInvoice(document)
              ? `Facture N° ${document.invoiceNumber}`
              : isQuote(document)
              ? `Devis N° ${document.quoteNumber}`
              : "Document"}
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={handleDownload}
              className="text-white hover:text-blue-400"
            >
              <Download />
            </button>
            <button onClick={onClose} className="text-white hover:text-red-400">
              <X />
            </button>
          </div>
        </div>

        {pdfUrl && (
          <iframe src={pdfUrl} className="flex-1 w-full" title="Document PDF" />
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
