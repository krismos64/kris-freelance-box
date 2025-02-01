import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import fs from "fs";
import path from "path";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    const documents = await DatabaseServices.getAllDocuments();
    res.json(documents);
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const uploadDocument = async (req: Request, res: Response) => {
  const { folderId } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "Aucun fichier téléchargé" });
  }

  try {
    const filePath = path.join(__dirname, "..", "..", "documents", file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      `INSERT INTO documents (name, file, folderId, uploadDate, type) 
      VALUES (?, ?, ?, ?, ?)`,
      [file.originalname, filePath, folderId, new Date(), file.mimetype.includes("pdf") ? "legal" : "other"]
    );

    res.status(201).json({
      id: result.insertId,
      name: file.originalname,
      file: filePath,
      folderId,
      uploadDate: new Date(),
      type: file.mimetype.includes("pdf") ? "legal" : "other",
    });
  } catch (error) {
    console.error("Erreur lors du téléchargement du document:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT file FROM documents WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Document non trouvé" });
    }

    const filePath = rows[0].file;
    fs.unlinkSync(filePath);

    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      "DELETE FROM documents WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Document non trouvé" });
    }

    res.json({ message: "Document supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du document:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
