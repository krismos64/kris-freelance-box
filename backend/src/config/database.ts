import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Configuration du pool de connexions
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

// Test de connexion
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

// Fonction générique pour exécuter des requêtes
export async function executeQuery<T>(
  query: string,
  params: any[] = []
): Promise<[T, any]> {
  try {
    const [results] = await pool.execute(query, params);
    return [results as T, null];
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête:", error);
    throw error;
  }
}

// Services de base de données
export const DatabaseServices = {
  executeQuery,

  // Clients
  async getAllClients() {
    const [rows] = await executeQuery<RowDataPacket[]>(
      "SELECT * FROM clients ORDER BY creationDate DESC"
    );
    return rows;
  },

  async getClientById(id: number) {
    const [rows] = await executeQuery<RowDataPacket[]>(
      "SELECT * FROM clients WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async createClient(clientData: any) {
    const [result] = await executeQuery<ResultSetHeader>(
      `INSERT INTO clients (
        name, email, phone, address, postalCode, 
        city, imageUrl, comments, creationDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clientData.name,
        clientData.email,
        clientData.phone,
        clientData.address,
        clientData.postalCode,
        clientData.city,
        clientData.imageUrl,
        clientData.comments,
        new Date(),
      ]
    );
    return { id: result.insertId, ...clientData };
  },

  async updateClient(id: number, clientData: any) {
    const [result] = await executeQuery<ResultSetHeader>(
      `UPDATE clients SET 
        name = ?, email = ?, phone = ?, address = ?, 
        postalCode = ?, city = ?, imageUrl = ?, comments = ? 
      WHERE id = ?`,
      [
        clientData.name,
        clientData.email,
        clientData.phone,
        clientData.address,
        clientData.postalCode,
        clientData.city,
        clientData.imageUrl,
        clientData.comments,
        id,
      ]
    );
    return result.affectedRows > 0;
  },

  async deleteClient(id: number) {
    const [result] = await executeQuery<ResultSetHeader>(
      "DELETE FROM clients WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  // Factures
  async getAllInvoices() {
    const [rows] = await executeQuery<RowDataPacket[]>(
      `SELECT i.*, c.name as clientName 
       FROM invoices i 
       LEFT JOIN clients c ON i.clientId = c.id 
       ORDER BY i.creationDate DESC`
    );
    return rows;
  },

  async getInvoiceById(id: number) {
    const [rows] = await executeQuery<RowDataPacket[]>(
      `SELECT i.*, c.name as clientName 
       FROM invoices i 
       LEFT JOIN clients c ON i.clientId = c.id 
       WHERE i.id = ?`,
      [id]
    );
    return rows[0];
  },

  async createInvoice(invoiceData: any) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Créer la facture
      const [invoiceResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO invoices (
          invoiceNumber, creationDate, dueDate, 
          clientId, total, status
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          invoiceData.invoiceNumber,
          invoiceData.creationDate,
          invoiceData.dueDate,
          invoiceData.clientId,
          invoiceData.total,
          "pending",
        ]
      );

      const invoiceId = invoiceResult.insertId;

      // Insérer les lignes de facture
      if (invoiceData.items && invoiceData.items.length > 0) {
        for (const item of invoiceData.items) {
          await connection.execute(
            `INSERT INTO invoice_items (
              invoiceId, description, quantity, unitPrice
            ) VALUES (?, ?, ?, ?)`,
            [invoiceId, item.description, item.quantity, item.unitPrice]
          );
        }
      }

      await connection.commit();
      return { id: invoiceId, ...invoiceData };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Devis
  async getAllQuotes() {
    const [rows] = await executeQuery<RowDataPacket[]>(
      `SELECT q.*, c.name as clientName 
       FROM quotes q 
       LEFT JOIN clients c ON q.clientId = c.id 
       ORDER BY q.creationDate DESC`
    );
    return rows;
  },

  async createQuote(quoteData: any) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [quoteResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO quotes (
          quoteNumber, creationDate, validUntil, 
          clientId, total, status
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          quoteData.quoteNumber,
          quoteData.creationDate,
          quoteData.validUntil,
          quoteData.clientId,
          quoteData.total,
          "pending",
        ]
      );

      const quoteId = quoteResult.insertId;

      if (quoteData.items && quoteData.items.length > 0) {
        for (const item of quoteData.items) {
          await connection.execute(
            `INSERT INTO quote_items (
              quoteId, description, quantity, unitPrice
            ) VALUES (?, ?, ?, ?)`,
            [quoteId, item.description, item.quantity, item.unitPrice]
          );
        }
      }

      await connection.commit();
      return { id: quoteId, ...quoteData };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Paiements
  async getAllPayments() {
    const [rows] = await executeQuery<RowDataPacket[]>(
      `SELECT p.*, i.invoiceNumber, c.name as clientName 
       FROM payments p 
       LEFT JOIN invoices i ON p.invoiceId = i.id 
       LEFT JOIN clients c ON i.clientId = c.id 
       ORDER BY p.paymentDate DESC`
    );
    return rows;
  },

  async createPayment(paymentData: any) {
    const [result] = await executeQuery<ResultSetHeader>(
      `INSERT INTO payments (
        invoiceId, amount, paymentDate, 
        paymentMethod, status, reference
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        paymentData.invoiceId,
        paymentData.amount,
        paymentData.paymentDate,
        paymentData.paymentMethod,
        paymentData.status,
        paymentData.reference,
      ]
    );
    return { id: result.insertId, ...paymentData };
  },

  // Entreprise
  async getCompanyInfo() {
    const [rows] = await executeQuery<RowDataPacket[]>(
      "SELECT * FROM company_info LIMIT 1"
    );
    return rows[0];
  },

  async updateCompanyInfo(companyData: any) {
    const [result] = await executeQuery<ResultSetHeader>(
      `UPDATE company_info SET 
        companyName = ?, siretNumber = ?, logoUrl = ?, 
        address = ?, postalCode = ?, city = ?, 
        phone = ?, email = ?, taxIdentification = ?, 
        businessSector = ?, foundedDate = ? 
      WHERE id = 1`,
      [
        companyData.companyName,
        companyData.siretNumber,
        companyData.logoUrl,
        companyData.address,
        companyData.postalCode,
        companyData.city,
        companyData.phone,
        companyData.email,
        companyData.taxIdentification,
        companyData.businessSector,
        companyData.foundedDate,
      ]
    );
    return result.affectedRows > 0;
  },

  // Revenus
  async getAllRevenues() {
    const [rows] = await executeQuery<RowDataPacket[]>(
      `SELECT 
        YEAR(paymentDate) as year,
        MONTH(paymentDate) as month,
        SUM(amount) as amount,
        MAX(paymentDate) as lastUpdated
       FROM payments
       WHERE status = 'payé'
       GROUP BY YEAR(paymentDate), MONTH(paymentDate)
       ORDER BY year DESC, month DESC`
    );
    return rows;
  },

  // Tâches
  async getAllTasks() {
    const [rows] = await executeQuery<RowDataPacket[]>(
      "SELECT * FROM tasks ORDER BY creationDate DESC"
    );
    return rows;
  },

  async createTask(taskData: any) {
    const [result] = await executeQuery<ResultSetHeader>(
      `INSERT INTO tasks (
        name, description, completed, 
        creationDate, dueDate, clientId
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        taskData.name,
        taskData.description,
        taskData.completed || false,
        new Date(),
        taskData.dueDate,
        taskData.clientId,
      ]
    );
    return { id: result.insertId, ...taskData };
  },

  async updateTask(id: number, taskData: any) {
    const [result] = await executeQuery<ResultSetHeader>(
      `UPDATE tasks SET 
        name = ?, description = ?, completed = ?, 
        dueDate = ?, clientId = ? 
      WHERE id = ?`,
      [
        taskData.name,
        taskData.description,
        taskData.completed,
        taskData.dueDate,
        taskData.clientId,
        id,
      ]
    );
    return result.affectedRows > 0;
  },
};

export default pool;
