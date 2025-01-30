const express = require("express");
const db = require("./db");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes pour les clients
app.get("/api/clients", (req, res) => {
  db.query("SELECT * FROM clients", (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des clients :", err);
      res.status(500).send("Erreur lors de la récupération des clients");
      return;
    }
    res.json(results);
  });
});

app.post("/api/clients", (req, res) => {
  const newClient = req.body;
  db.query("INSERT INTO clients SET ?", newClient, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout du client :", err);
      res.status(500).send("Erreur lors de l'ajout du client");
      return;
    }
    res
      .status(201)
      .json({ message: "Client ajouté avec succès", id: results.insertId });
  });
});

// Routes pour les devis
app.get("/api/quotes", (req, res) => {
  db.query("SELECT * FROM quotes", (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des devis :", err);
      res.status(500).send("Erreur lors de la récupération des devis");
      return;
    }
    res.json(results);
  });
});

app.post("/api/quotes", (req, res) => {
  const newQuote = req.body;
  db.query("INSERT INTO quotes SET ?", newQuote, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout du devis :", err);
      res.status(500).send("Erreur lors de l'ajout du devis");
      return;
    }
    res
      .status(201)
      .json({ message: "Devis ajouté avec succès", id: results.insertId });
  });
});

// Routes pour les factures
app.get("/api/invoices", (req, res) => {
  db.query("SELECT * FROM invoices", (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des factures :", err);
      res.status(500).send("Erreur lors de la récupération des factures");
      return;
    }
    res.json(results);
  });
});

app.post("/api/invoices", (req, res) => {
  const newInvoice = req.body;
  db.query("INSERT INTO invoices SET ?", newInvoice, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout de la facture :", err);
      res.status(500).send("Erreur lors de l'ajout de la facture");
      return;
    }
    res
      .status(201)
      .json({ message: "Facture ajoutée avec succès", id: results.insertId });
  });
});

// Routes pour les revenus
app.get("/api/revenues", (req, res) => {
  db.query("SELECT * FROM revenues", (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des revenus :", err);
      res.status(500).send("Erreur lors de la récupération des revenus");
      return;
    }
    res.json(results);
  });
});

app.post("/api/revenues", (req, res) => {
  const newRevenue = req.body;
  db.query("INSERT INTO revenues SET ?", newRevenue, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout du revenu :", err);
      res.status(500).send("Erreur lors de l'ajout du revenu");
      return;
    }
    res
      .status(201)
      .json({ message: "Revenu ajouté avec succès", id: results.insertId });
  });
});

// Routes pour les documents
app.get("/api/documents", (req, res) => {
  db.query("SELECT * FROM documents", (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des documents :", err);
      res.status(500).send("Erreur lors de la récupération des documents");
      return;
    }
    res.json(results);
  });
});

app.post("/api/documents", (req, res) => {
  const newDocument = req.body;
  db.query("INSERT INTO documents SET ?", newDocument, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout du document :", err);
      res.status(500).send("Erreur lors de l'ajout du document");
      return;
    }
    res
      .status(201)
      .json({ message: "Document ajouté avec succès", id: results.insertId });
  });
});

// Routes pour les dossiers
app.get("/api/folders", (req, res) => {
  db.query("SELECT * FROM folders", (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des dossiers :", err);
      res.status(500).send("Erreur lors de la récupération des dossiers");
      return;
    }
    res.json(results);
  });
});

app.post("/api/folders", (req, res) => {
  const newFolder = req.body;
  db.query("INSERT INTO folders SET ?", newFolder, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout du dossier :", err);
      res.status(500).send("Erreur lors de l'ajout du dossier");
      return;
    }
    res
      .status(201)
      .json({ message: "Dossier ajouté avec succès", id: results.insertId });
  });
});

// Routes pour les tâches
app.get("/api/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des tâches :", err);
      res.status(500).send("Erreur lors de la récupération des tâches");
      return;
    }
    res.json(results);
  });
});

app.post("/api/tasks", (req, res) => {
  const newTask = req.body;
  db.query("INSERT INTO tasks SET ?", newTask, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout de la tâche :", err);
      res.status(500).send("Erreur lors de l'ajout de la tâche");
      return;
    }
    res
      .status(201)
      .json({ message: "Tâche ajoutée avec succès", id: results.insertId });
  });
});

// Routes pour l'entreprise
app.get("/api/company", (req, res) => {
  db.query("SELECT * FROM company LIMIT 1", (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des informations de l'entreprise :",
        err
      );
      res
        .status(500)
        .send(
          "Erreur lors de la récupération des informations de l'entreprise"
        );
      return;
    }
    res.json(results[0] || {}); // Retourne le premier résultat ou un objet vide
  });
});

app.post("/api/company", (req, res) => {
  const newCompany = req.body;
  db.query("INSERT INTO company SET ?", newCompany, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de l'ajout des informations de l'entreprise :",
        err
      );
      res
        .status(500)
        .send("Erreur lors de l'ajout des informations de l'entreprise");
      return;
    }
    res
      .status(201)
      .json({
        message: "Informations de l'entreprise ajoutées avec succès",
        id: results.insertId,
      });
  });
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
