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
    const { name, email, phone, address } = clientData;
    return executeQuery(
      "INSERT INTO clients (name, email, phone, address, creationDate) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, address, new Date()]
    );
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

  // Devis
  async getAllQuotes() {
    return executeQuery("SELECT * FROM quotes");
  },

  // Tâches
  async getAllTasks() {
    return executeQuery("SELECT * FROM tasks");
  },

  // Documents
  async getAllDocuments() {
    return executeQuery("SELECT * FROM documents");
  },

  // Paiements
  async getAllPayments() {
    return executeQuery("SELECT * FROM payments");
  },
};

export default pool;
