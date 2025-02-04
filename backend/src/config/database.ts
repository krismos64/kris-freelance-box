import { createPool, Pool } from "mysql2/promise";

// Configuration de la base de données
interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
  connectionLimit?: number;
}

const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "freelancebox",
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 10,
};

// Création d'un pool de connexions à la base de données
let pool: Pool;

export const initializeDatabase = (): void => {
  if (!pool) {
    pool = createPool(dbConfig);
    console.log("Connexion à la base de données initialisée");
  }
};

// Fonction générique pour exécuter une requête SQL
export const executeQuery = async <T>(
  query: string,
  params: any[] = []
): Promise<T> => {
  if (!pool) {
    throw new Error("La base de données n'a pas été initialisée");
  }

  try {
    const [results] = await pool.execute(query, params);
    return results as T;
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête SQL :", error);
    throw error;
  }
};

// Fonction pour fermer la connexion à la base de données
export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    console.log("Connexion à la base de données fermée");
  }
};
