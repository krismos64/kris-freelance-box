import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { executeQuery } from "../config/database";

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtenir tous les documents
export const getAllDocuments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const documents = await executeQuery("SELECT * FROM documents");
    res.status(200).json(documents);
  } catch (error) {
    console.error("Erreur lors de la récupération des documents :", error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des documents",
    });
  }
};

// Obtenir un document par ID
export const getDocumentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const document: any[] = await executeQuery(
      "SELECT * FROM documents WHERE id = ?",
      [id]
    );

    if (!document || document.length === 0) {
      res.status(404).json({ message: "Document non trouvé" });
      return;
    }

    res.status(200).json(document[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du document :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération du document" });
  }
};

// Créer un nouveau document
export const createDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, type, content, folderId } = req.body;

    const result = (await executeQuery(
      "INSERT INTO documents (title, type, content, folderId) VALUES (?, ?, ?, ?)",
      [title, type, content, folderId]
    )) as { insertId: number };

    const newDocument = (await executeQuery(
      "SELECT * FROM documents WHERE id = ?",
      [result.insertId]
    )) as any[];

    res.status(201).json(newDocument[0]);
  } catch (error) {
    console.error("Erreur lors de la création du document :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la création du document" });
  }
};

// Mettre à jour un document existant
export const updateDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, type, content, folderId } = req.body;

    const document = (await executeQuery(
      "SELECT * FROM documents WHERE id = ?",
      [id]
    )) as any[];

    if (!document || document.length === 0) {
      res.status(404).json({ message: "Document non trouvé" });
      return;
    }

    await executeQuery(
      "UPDATE documents SET title = ?, type = ?, content = ?, folderId = ? WHERE id = ?",
      [title, type, content, folderId, id]
    );

    const updatedDocument = (await executeQuery(
      "SELECT * FROM documents WHERE id = ?",
      [id]
    )) as any[];

    res.status(200).json(updatedDocument[0]);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du document :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour du document" });
  }
};

// Supprimer un document
export const deleteDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const document = (await executeQuery(
      "SELECT * FROM documents WHERE id = ?",
      [id]
    )) as any[];

    if (!document || document.length === 0) {
      res.status(404).json({ message: "Document non trouvé" });
      return;
    }

    await executeQuery("DELETE FROM documents WHERE id = ?", [id]);

    res.status(204).send();
  } catch (error) {
    console.error("Erreur lors de la suppression du document :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression du document" });
  }
};
