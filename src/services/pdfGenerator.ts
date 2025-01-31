import jsPDF from 'jspdf'
import { Invoice, Quote, Client, Company } from '../types/database'
import { mockCompany } from '../mocks/mockData'

export class PDFGenerator {
  // Méthode de génération de facture avec console.log pour débogage
  generateInvoicePDF(invoice: Invoice, client: Client) {
    console.log('Génération de facture PDF - Début')
    console.log('Facture:', invoice)
    console.log('Client:', client)

    try {
      // Créer un nouveau document PDF
      const doc = new jsPDF()

      // En-tête de l'entreprise
      doc.setFontSize(10)
      doc.text(`Entreprise: ${mockCompany.companyName}`, 20, 20)
      doc.text(`Adresse: ${mockCompany.address}`, 20, 30)

      // Informations de la facture
      doc.setFontSize(14)
      doc.text(`FACTURE N° ${invoice.invoiceNumber}`, 20, 50)

      // Informations du client
      doc.setFontSize(10)
      doc.text(`Client: ${client.name}`, 20, 70)
      doc.text(`Email: ${client.email || 'N/A'}`, 20, 80)

      // Détails de la facture
      doc.text(`Date: ${new Date(invoice.creationDate).toLocaleDateString()}`, 20, 90)
      doc.text(`Échéance: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 100)

      // Lignes de facturation
      doc.setFontSize(12)
      doc.text('Détail des Prestations', 20, 120)

      let yPosition = 130
      invoice.items?.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.description}`, 20, yPosition)
        doc.text(`Quantité: ${item.quantity}`, 120, yPosition)
        doc.text(`Prix unitaire: ${item.unitPrice}€`, 150, yPosition)
        doc.text(`Total: ${item.quantity * item.unitPrice}€`, 180, yPosition)
        yPosition += 10
      })

      // Total de la facture
      doc.setFontSize(14)
      doc.text(`TOTAL: ${invoice.total}€`, 150, yPosition + 20)

      console.log('Tentative de sauvegarde du PDF')
      
      // Méthode alternative de sauvegarde
      const pdfBlob = doc.output('blob')
      const pdfUrl = URL.createObjectURL(pdfBlob)
      
      console.log('URL du PDF:', pdfUrl)

      // Ouvrir dans un nouvel onglet
      window.open(pdfUrl, '_blank')

      // Option de téléchargement
      doc.save(`Facture-${invoice.invoiceNumber}.pdf`)

      console.log('Génération de facture PDF - Terminé')
    } catch (error) {
      console.error('ERREUR CRITIQUE lors de la génération du PDF de facture:', error)
    }
  }

  // Méthode similaire pour les devis
  generateQuotePDF(quote: Quote, client: Client) {
    console.log('Génération de devis PDF - Début')
    console.log('Devis:', quote)
    console.log('Client:', client)

    try {
      const doc = new jsPDF()

      // En-tête de l'entreprise
      doc.setFontSize(10)
      doc.text(`Entreprise: ${mockCompany.companyName}`, 20, 20)
      doc.text(`Adresse: ${mockCompany.address}`, 20, 30)

      // Informations du devis
      doc.setFontSize(14)
      doc.text(`DEVIS N° ${quote.quoteNumber}`, 20, 50)

      // Informations du client
      doc.setFontSize(10)
      doc.text(`Client: ${client.name}`, 20, 70)
      doc.text(`Email: ${client.email || 'N/A'}`, 20, 80)

      // Détails du devis
      doc.text(`Date: ${new Date(quote.creationDate).toLocaleDateString()}`, 20, 90)
      doc.text(`Valide jusqu'au: ${new Date(quote.validUntil).toLocaleDateString()}`, 20, 100)

      // Lignes de devis
      doc.setFontSize(12)
      doc.text('Détail des Prestations', 20, 120)

      let yPosition = 130
      quote.items?.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.description}`, 20, yPosition)
        doc.text(`Quantité: ${item.quantity}`, 120, yPosition)
        doc.text(`Prix unitaire: ${item.unitPrice}€`, 150, yPosition)
        doc.text(`Total: ${item.quantity * item.unitPrice}€`, 180, yPosition)
        yPosition += 10
      })

      // Total du devis
      doc.setFontSize(14)
      doc.text(`TOTAL: ${quote.total}€`, 150, yPosition + 20)

      console.log('Tentative de sauvegarde du PDF')
      
      // Méthode alternative de sauvegarde
      const pdfBlob = doc.output('blob')
      const pdfUrl = URL.createObjectURL(pdfBlob)
      
      console.log('URL du PDF:', pdfUrl)

      // Ouvrir dans un nouvel onglet
      window.open(pdfUrl, '_blank')

      // Option de téléchargement
      doc.save(`Devis-${quote.quoteNumber}.pdf`)

      console.log('Génération de devis PDF - Terminé')
    } catch (error) {
      console.error('ERREUR CRITIQUE lors de la génération du PDF de devis:', error)
    }
  }
}

export const pdfGenerator = new PDFGenerator()
