import { Request, Response } from "express";
import { DatabaseServices } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const getCompany = async (_req: Request, res: Response) => {
  try {
    const [rows] = await DatabaseServices.executeQuery<RowDataPacket[]>(
      "SELECT * FROM company_info LIMIT 1"
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Informations de l'entreprise non trouvées" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de l'entreprise:",
      error
    );
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateCompany = async (_req: Request, res: Response) => {
  try {
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
    } = _req.body;

    const [result] = await DatabaseServices.executeQuery<ResultSetHeader>(
      `UPDATE company_info 
       SET companyName = ?, 
           siretNumber = ?, 
           logoUrl = ?, 
           address = ?, 
           postalCode = ?, 
           city = ?, 
           phone = ?, 
           email = ?, 
           taxIdentification = ?, 
           businessSector = ?, 
           foundedDate = ?
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
      return res
        .status(404)
        .json({ error: "Informations de l'entreprise non trouvées" });
    }

    res.json({
      success: true,
      message: "Données de l'entreprise mises à jour avec succès",
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des données de l'entreprise:",
      error
    );
    res.status(500).json({ error: "Erreur serveur" });
  }
};
