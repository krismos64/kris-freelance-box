import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

// Configuration de la connexion
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fonction de test de connexion
export async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connexion à la base de données réussie !");
    connection.release();
    return true;
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error);
    return false;
  }
}

// Service générique pour les requêtes
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête:", error);
    throw error;
  }
}

// Services spécifiques
export const DatabaseServices = {
  // Clients
  async getAllClients() {
    return executeQuery("SELECT * FROM clients");
  },

  async getClientById(id: number) {
    return executeQuery("SELECT * FROM clients WHERE id = ?", [id]);
  },

  async createClient(clientData: any) {
    const {
      name,
      email,
      phone,
      address,
      postalCode,
      city,
      imageUrl,
      comments,
    } = clientData;
    try {
      const [result] = await executeQuery(
        "INSERT INTO clients (name, email, phone, address, postalCode, city, imageUrl, comments, creationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          email,
          phone,
          address,
          postalCode,
          city,
          imageUrl,
          comments,
          new Date(),
        ]
      );
      return result;
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      throw error;
    }
  },

  // Factures
  async getAllInvoices() {
    return executeQuery("SELECT * FROM invoices");
  },

  async getInvoicesByClientId(clientId: number) {
    return executeQuery("SELECT * FROM invoices WHERE clientId = ?", [
      clientId,
    ]);
  },

  async createInvoice(invoiceData: any) {
    const { invoiceNumber, creationDate, dueDate, clientId, total, items } =
      invoiceData;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Créer la facture
      const [invoiceResult] = await connection.execute(
        "INSERT INTO invoices (invoiceNumber, creationDate, dueDate, clientId, total) VALUES (?, ?, ?, ?, ?)",
        [invoiceNumber, creationDate, dueDate, clientId, total]
      );

      const invoiceId = (invoiceResult as any).insertId;

      // Insérer les lignes de facture
      if (items && items.length > 0) {
        const itemQueries = items.map(() => "(?, ?, ?, ?)").join(", ");
        const itemValues = items.flatMap((item: any) => [
          invoiceId,
          item.description,
          item.quantity,
          item.unitPrice,
        ]);

        await connection.execute(
          `INSERT INTO invoice_items (invoiceId, description, quantity, unitPrice) VALUES ${itemQueries}`,
          itemValues
        );
      }

      await connection.commit();
      return { id: invoiceId, message: "Facture créée avec succès" };
    } catch (error) {
      await connection.rollback();
      console.error("Erreur lors de la création de la facture:", error);
      throw error;
    } finally {
      connection.release();
    }
  },

  // Devis
  async getAllQuotes() {
    return executeQuery("SELECT * FROM quotes");
  },

  async getQuoteById(id: number) {
    return executeQuery("SELECT * FROM quotes WHERE id = ?", [id]);
  },

  async createQuote(quoteData: any) {
    const { quoteNumber, creationDate, validUntil, clientId, total, items } =
      quoteData;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Créer le devis
      const [quoteResult] = await connection.execute(
        "INSERT INTO quotes (quoteNumber, creationDate, validUntil, clientId, total) VALUES (?, ?, ?, ?, ?)",
        [quoteNumber, creationDate, validUntil, clientId, total]
      );

      const quoteId = (quoteResult as any).insertId;

      // Insérer les lignes de devis
      if (items && items.length > 0) {
        const itemQueries = items.map(() => "(?, ?, ?, ?)").join(", ");
        const itemValues = items.flatMap((item: any) => [
          quoteId,
          item.description,
          item.quantity,
          item.unitPrice,
        ]);

        await connection.execute(
          `INSERT INTO quote_items (quoteId, description, quantity, unitPrice) VALUES ${itemQueries}`,
          itemValues
        );
      }

      await connection.commit();
      return { id: quoteId, message: "Devis créé avec succès" };
    } catch (error) {
      await connection.rollback();
      console.error("Erreur lors de la création du devis:", error);
      throw error;
    } finally {
      connection.release();
    }
  },

  // Tâches
  async getAllTasks() {
    return executeQuery("SELECT * FROM tasks");
  },

  async createTask(taskData: any) {
    const { name, description, completed } = taskData;
    try {
      const [result] = await executeQuery(
        "INSERT INTO tasks (name, description, completed) VALUES (?, ?, ?)",
        [name, description, completed]
      );
      return result;
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      throw error;
    }
  },

  // Documents
  async getAllDocuments() {
    return executeQuery("SELECT * FROM documents");
  },

  async uploadDocument(file: any, folderId: number) {
    const filePath = `/documents/${file.originalname}`;
    try {
      const [result] = await executeQuery(
        "INSERT INTO documents (name, file, folderId, uploadDate, type) VALUES (?, ?, ?, ?, ?)",
        [
          file.originalname,
          filePath,
          folderId,
          new Date(),
          file.mimetype.includes("pdf") ? "legal" : "other",
        ]
      );
      return result;
    } catch (error) {
      console.error("Erreur lors du téléchargement du document:", error);
      throw error;
    }
  },

  // Paiements
  async getAllPayments() {
    return executeQuery("SELECT * FROM payments");
  },

  async getPaymentById(id: number) {
    return executeQuery("SELECT * FROM payments WHERE id = ?", [id]);
  },

  async createPayment(paymentData: any) {
    const { invoiceId, amount, paymentDate, paymentMethod, status, reference } =
      paymentData;
    try {
      const [result] = await executeQuery(
        "INSERT INTO payments (invoiceId, amount, paymentDate, paymentMethod, status, reference) VALUES (?, ?, ?, ?, ?, ?)",
        [invoiceId, amount, paymentDate, paymentMethod, status, reference]
      );
      return result;
    } catch (error) {
      console.error("Erreur lors de la création du paiement:", error);
      throw error;
    }
  },

  // Informations de l'entreprise
  async getCompanyInfo() {
    return executeQuery("SELECT * FROM company_info LIMIT 1");
  },

  async updateCompanyInfo(companyData: any) {
    const {
      companyName,
      siretNumber,
      logoUrl,
      address,
      postalCode,
      city,
      phone,
      email,
      taxIdentification,
      businessSector,
      foundedDate,
    } = companyData;

    try {
      const [result] = await executeQuery(
        `UPDATE company_info 
        SET companyName = ?, siretNumber = ?, logoUrl = ?, address = ?, postalCode = ?, city = ?, phone = ?, email = ?, taxIdentification = ?, businessSector = ?, foundedDate = ? 
        WHERE id = 1`,
        [
          companyName,
          siretNumber,
          logoUrl,
          address,
          postalCode,
          city,
          phone,
          email,
          taxIdentification,
          businessSector,
          foundedDate,
        ]
      );

      if (result.affectedRows === 0) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des données de l'entreprise:",
        error
      );
      return false;
    }
  },

  // Revenus
  async getAllRevenues() {
    return executeQuery("SELECT * FROM revenues");
  },

  async updateRevenue(month: Date, amount: number) {
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    try {
      const [rows] = await executeQuery<RowDataPacket[]>(
        "SELECT * FROM revenues WHERE month = ?",
        [monthStart]
      );

      if (rows.length > 0) {
        // Si le mois existe, mettre à jour le montant
        await executeQuery<ResultSetHeader>(
          "UPDATE revenues SET amount = amount + ? WHERE month = ?",
          [amount, monthStart]
        );
      } else {
        // Si le mois n'existe pas, créer une nouvelle entrée
        await executeQuery<ResultSetHeader>(
          "INSERT INTO revenues (month, amount) VALUES (?, ?)",
          [monthStart, amount]
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des revenus:", error);
    }
  },
};

export default pool;
