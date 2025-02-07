import { Request, Response } from "express";
import { executeQuery } from "../config/database";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

interface CompanyData {
  name: string;
  registrationNumber: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  logoUrl?: string;
}

function validateCompanyData(companyData: CompanyData): string[] {
  const errors: string[] = [];

  if (!companyData.name) errors.push("Le nom de l'entreprise est requis");
  if (!companyData.registrationNumber)
    errors.push("Le numéro d'enregistrement est requis");
  if (!companyData.email || !validateEmail(companyData.email))
    errors.push("Un email valide est requis");
  if (!companyData.phone) errors.push("Le numéro de téléphone est requis");

  return errors;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const getAllCompanies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const companies = await executeQuery<CompanyData[]>(
      "SELECT * FROM companies"
    );
    res.status(200).json(companies);
  } catch (error) {
    console.error("Erreur lors de la récupération des entreprises :", error);
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la récupération des entreprises",
    });
  }
};

export const getCompanyById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const companyId = parseInt(req.params.id);
    if (isNaN(companyId)) {
      res.status(400).json({ error: "ID d'entreprise invalide" });
      return;
    }

    const company = await executeQuery<CompanyData[]>(
      "SELECT * FROM companies WHERE id = ?",
      [companyId]
    );
    if (company.length === 0) {
      res.status(404).json({ error: "Entreprise non trouvée" });
      return;
    }

    res.status(200).json(company[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'entreprise :", error);
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la récupération de l'entreprise",
    });
  }
};

export const createCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const companyData: CompanyData = req.body;
    const validationErrors = validateCompanyData(companyData);

    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    await executeQuery(
      "INSERT INTO companies (name, registrationNumber, address, postalCode, city, phone, email, logoUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        companyData.name,
        companyData.registrationNumber,
        companyData.address,
        companyData.postalCode,
        companyData.city,
        companyData.phone,
        companyData.email,
        companyData.logoUrl || null,
      ]
    );

    res.status(201).json({ message: "Entreprise créée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la création de l'entreprise :", error);
    res.status(500).json({
      error: "Une erreur s'est produite lors de la création de l'entreprise",
    });
  }
};

export const updateCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const companyId = parseInt(req.params.id);
    if (isNaN(companyId)) {
      res.status(400).json({ error: "ID d'entreprise invalide" });
      return;
    }

    if (req.file) {
      const logoPath = `/uploads/${req.file.filename}`;
      req.body.logoUrl = logoPath;
    }

    const companyData: Partial<CompanyData> = req.body;

    if (Object.keys(companyData).length === 0) {
      res
        .status(400)
        .json({ error: "Aucune donnée fournie pour la mise à jour" });
      return;
    }

    // Filtrer les champs définis uniquement
    const fieldsToUpdate = Object.entries(companyData).filter(
      ([_, value]) => value !== undefined
    );
    if (fieldsToUpdate.length === 0) {
      res
        .status(400)
        .json({ error: "Aucune donnée valide fournie pour la mise à jour" });
      return;
    }

    // Générer dynamiquement la requête SQL
    const query = `UPDATE companies SET ${fieldsToUpdate
      .map(([key]) => `${key} = ?`)
      .join(", ")} WHERE id = ?`;
    const values = fieldsToUpdate.map(([_, value]) => value);
    values.push(companyId.toString());

    await executeQuery(query, values);

    res.status(200).json({ message: "Entreprise mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'entreprise :", error);
    res
      .status(500)
      .json({
        error:
          "Une erreur s'est produite lors de la mise à jour de l'entreprise",
      });
  }
};

export const deleteCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const companyId = parseInt(req.params.id);
    if (isNaN(companyId)) {
      res.status(400).json({ error: "ID d'entreprise invalide" });
      return;
    }

    await executeQuery("DELETE FROM companies WHERE id = ?", [companyId]);
    res.status(200).json({ message: "Entreprise supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'entreprise :", error);
    res.status(500).json({
      error: "Une erreur s'est produite lors de la suppression de l'entreprise",
    });
  }
};
