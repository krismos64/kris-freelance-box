import React, { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import jsPDF from "jspdf";
import {
  Invoice,
  Quote,
  Client,
  Company,
  DocumentType,
} from "../types/database";
import { mockCompany } from "../mocks/mockData";

interface PDFViewerProps {
  document: Document;
  client: Client;
  type: DocumentType;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  document,
  client,
  type,
  onClose,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const isInvoice = (doc: any): doc is Invoice => doc.type === "invoice";
  const isQuote = (doc: any): doc is Quote => doc.type === "quote";

  const generatePDF = () => {
    const doc = new jsPDF();

    // En-tête de l'entreprise
    doc.setFontSize(10);
    doc.text(`Entreprise: ${mockCompany.companyName}`, 20, 20);
    doc.text(`Adresse: ${mockCompany.address}`, 20, 30);

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
      : {
          date: new Date((document as Quote).issuedAt).toLocaleDateString(),
          dueDate: new Date(
            (document as Quote).validUntil
          ).toLocaleDateString(),
          label: "Valide jusqu'au",
        };

    doc.text(`Date: ${details.date}`, 20, 90);
    doc.text(`${details.label}: ${details.dueDate}`, 20, 100);

    // Lignes de document
    doc.setFontSize(12);
    doc.text("Détail des Prestations", 20, 120);

    let yPosition = 130;
    const items = isInvoice(document)
      ? document.items
      : (document as Quote).items;

    items?.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.description}`, 20, yPosition);
      doc.text(`Quantité: ${item.quantity}`, 120, yPosition);
      doc.text(`Prix unitaire: ${item.unitPrice}€`, 150, yPosition);
      doc.text(`Total: ${item.quantity * item.unitPrice}€`, 180, yPosition);
      yPosition += 10;
    });

    // Total du document
    doc.setFontSize(14);
    doc.text(`TOTAL: ${document.total}€`, 150, yPosition + 20);

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
              : `Devis N° ${document.quoteNumber}`}
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
