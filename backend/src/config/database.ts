import { createPool, Pool } from "mysql2/promise";
import winston from "winston";
import fs from "fs";
import path from "path";

// Interface pour la configuration de la base de données
interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
  connectionLimit?: number;
}

export const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "kris_freelancebox",
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 10,
};

// Création automatique du dossier "logs" si nécessaire
const logsDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

// Configuration du logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logsDirectory, "database.log"),
    }),
  ],
});

// Création d'un pool de connexions à la base de données
let pool: Pool | null = null;

// Fonction d'initialisation de la base de données
export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!pool) {
      logger.info("Création du pool de connexions...");
      pool = createPool(dbConfig);
      await pool.getConnection(); // Vérification de la connexion initiale
      logger.info("Connexion à la base de données initialisée avec succès");
    }
  } catch (error: unknown) {
    const typedError =
      error instanceof Error ? error : new Error(String(error));
    logger.error("Erreur lors de l'initialisation de la base de données :", {
      message: typedError.message,
      stack: typedError.stack,
    });
    throw typedError;
  }
};

// Fonction générique pour exécuter une requête SQL
export const executeQuery = async <T>(
  query: string,
  params: any[] = []
): Promise<T> => {
  if (!pool) {
    logger.error("La base de données n'a pas été initialisée");
    throw new Error("La base de données n'a pas été initialisée");
  }

  try {
    logger.info(`Exécution de la requête SQL : ${query}`);
    const [results] = await pool.execute(query, params);
    logger.info("Requête exécutée avec succès");
    return results as T;
  } catch (error: unknown) {
    const typedError =
      error instanceof Error ? error : new Error(String(error));
    logger.error("Erreur lors de l'exécution de la requête SQL :", {
      message: typedError.message,
      stack: typedError.stack,
    });
    throw typedError;
  }
};

// Gestion de la reconnexion automatique en cas de défaillance
export const reconnect = async (): Promise<void> => {
  try {
    logger.warn("Tentative de reconnexion à la base de données...");
    await closeDatabase();
    await initializeDatabase();
    logger.info("Reconnexion réussie");
  } catch (error: unknown) {
    const typedError =
      error instanceof Error ? error : new Error(String(error));
    logger.error("Échec de la reconnexion à la base de données :", {
      message: typedError.message,
      stack: typedError.stack,
    });
    throw typedError;
  }
};

// Fonction pour fermer la connexion à la base de données
export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    try {
      await pool.end();
      logger.info("Connexion à la base de données fermée");
    } catch (error: unknown) {
      const typedError =
        error instanceof Error ? error : new Error(String(error));
      logger.error(
        "Erreur lors de la fermeture de la connexion à la base de données :",
        {
          message: typedError.message,
          stack: typedError.stack,
        }
      );
    }
  }
};
