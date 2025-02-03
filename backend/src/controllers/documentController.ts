import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import path from "path";
import fs from "fs";

export const getAllDocuments = async (_req: Request, res: Response) => {
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT d.*, f.name as folderName
       FROM documents d
       LEFT JOIN folders f ON d.folderId = f.id
       ORDER BY d.uploadDate DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getDocumentById = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      `SELECT d.*, f.name as folderName
       FROM documents d
       LEFT JOIN folders f ON d.folderId = f.id
       WHERE d.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Document non trouvé" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du document:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const uploadDocument = async (_req: Request, res: Response) => {
  if (!_req.file) {
    return res.status(400).json({ error: "Aucun fichier téléchargé" });
  }

  try {
    const { folderId } = _req.body;
    const file = _req.file;
    const uploadDir = path.join(__dirname, "..", "..", "documents");

    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      `INSERT INTO documents (
        name, file, folderId, uploadDate, type
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        file.originalname,
        `/documents/${file.originalname}`,
        folderId,
        new Date(),
        file.mimetype.includes("pdf") ? "legal" : "other",
      ]
    );

    res.status(201).json({
      id: result.insertId,
      name: file.originalname,
      file: `/documents/${file.originalname}`,
      folderId,
      uploadDate: new Date(),
      type: file.mimetype.includes("pdf") ? "legal" : "other",
    });
  } catch (error) {
    console.error("Erreur lors du téléchargement du document:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteDocument = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  try {
    // Récupérer le chemin du fichier avant la suppression
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT file FROM documents WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Document non trouvé" });
    }

    const filePath = path.join(__dirname, "..", "..", rows[0].file);

    // Supprimer le fichier physique
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer l'entrée de la base de données
    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      "DELETE FROM documents WHERE id = ?",
      [id]
    );

    res.json({ message: "Document supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du document:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
