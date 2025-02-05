import jsPDF from "jspdf";
import { Invoice, Quote, Client, Company } from "../types/database";

export class PDFGenerator {
  // Méthode de génération de facture PDF
  generateInvoicePDF(invoice: Invoice, client: Client, company: Company) {
    console.log("Génération de facture PDF - Début");
    console.log("Facture:", invoice);
    console.log("Client:", client);
    console.log("Entreprise:", company);

    try {
      const doc = new jsPDF();

      // En-tête de l'entreprise
      doc.setFontSize(10);
      doc.text(`Entreprise: ${company.companyName}`, 20, 20);
      doc.text(`Adresse: ${company.address}`, 20, 30);
      doc.text(`Email: ${company.email}`, 20, 40);

      // Informations de la facture
      doc.setFontSize(14);
      doc.text(`FACTURE N° ${invoice.invoiceNumber}`, 20, 60);

      // Informations du client
      doc.setFontSize(10);
      doc.text(`Client: ${client.name}`, 20, 80);
      doc.text(`Email: ${client.email || "N/A"}`, 20, 90);

      // Détails de la facture
      doc.text(
        `Date: ${
          invoice.creationDate
            ? new Date(invoice.creationDate).toLocaleDateString()
            : "N/A"
        }`,
        20,
        100
      );
      doc.text(
        `Échéance: ${new Date(invoice.dueDate).toLocaleDateString()}`,
        20,
        110
      );

      // Lignes de facturation
      doc.setFontSize(12);
      doc.text("Détail des Prestations", 20, 130);

      let yPosition = 140;
      invoice.items?.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.description}`, 20, yPosition);
        doc.text(`Quantité: ${item.quantity}`, 120, yPosition);
        doc.text(
          `Prix unitaire: ${item.unitPrice.toFixed(2)}€`,
          150,
          yPosition
        );
        doc.text(
          `Total: ${(item.quantity * item.unitPrice).toFixed(2)}€`,
          180,
          yPosition
        );
        yPosition += 10;
      });

      // Total de la facture
      doc.setFontSize(14);
      doc.text(`TOTAL: ${invoice.total.toFixed(2)}€`, 150, yPosition + 20);

      // Sauvegarde et affichage du PDF
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      doc.save(`Facture-${invoice.invoiceNumber}.pdf`);

      console.log("Génération de facture PDF - Terminé");
    } catch (error) {
      console.error(
        "ERREUR CRITIQUE lors de la génération du PDF de facture:",
        error
      );
    }
  }

  // Méthode de génération de devis PDF
  generateQuotePDF(quote: Quote, client: Client, company: Company) {
    console.log("Génération de devis PDF - Début");
    console.log("Devis:", quote);
    console.log("Client:", client);
    console.log("Entreprise:", company);

    try {
      const doc = new jsPDF();

      // En-tête de l'entreprise
      doc.setFontSize(10);
      doc.text(`Entreprise: ${company.companyName}`, 20, 20);
      doc.text(`Adresse: ${company.address}`, 20, 30);
      doc.text(`Email: ${company.email}`, 20, 40);

      // Informations du devis
      doc.setFontSize(14);
      doc.text(`DEVIS N° ${quote.quoteNumber}`, 20, 60);

      // Informations du client
      doc.setFontSize(10);
      doc.text(`Client: ${client.name}`, 20, 80);
      doc.text(`Email: ${client.email || "N/A"}`, 20, 90);

      // Détails du devis
      doc.text(
        `Date: ${
          quote.creationDate
            ? new Date(quote.creationDate).toLocaleDateString()
            : "N/A"
        }`,
        20,
        100
      );
      doc.text(
        `Valide jusqu'au: ${new Date(quote.validUntil).toLocaleDateString()}`,
        20,
        110
      );

      // Lignes de devis
      doc.setFontSize(12);
      doc.text("Détail des Prestations", 20, 130);

      let yPosition = 140;
      quote.items?.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.description}`, 20, yPosition);
        doc.text(`Quantité: ${item.quantity}`, 120, yPosition);
        doc.text(
          `Prix unitaire: ${item.unitPrice.toFixed(2)}€`,
          150,
          yPosition
        );
        doc.text(
          `Total: ${(item.quantity * item.unitPrice).toFixed(2)}€`,
          180,
          yPosition
        );
        yPosition += 10;
      });

      // Total du devis
      doc.setFontSize(14);
      doc.text(`TOTAL: ${quote.total.toFixed(2)}€`, 150, yPosition + 20);

      // Sauvegarde et affichage du PDF
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      doc.save(`Devis-${quote.quoteNumber}.pdf`);

      console.log("Génération de devis PDF - Terminé");
    } catch (error) {
      console.error(
        "ERREUR CRITIQUE lors de la génération du PDF de devis:",
        error
      );
    }
  }
}

export const pdfGenerator = new PDFGenerator();
