    # FreelanceBox

FreelanceBox est une application complète conçue pour aider les freelances à gérer leurs clients, factures, devis, tâches, documents et informations de l'entreprise de manière efficace. Ce projet est construit avec React, TypeScript et Vite pour le frontend, et Node.js avec TypeScript pour le backend.

## Fonctionnalités

- **Gestion des Clients**: Ajouter, visualiser, modifier et supprimer des informations clients.
- **Gestion des Factures**: Créer, visualiser et gérer des factures avec des détails détaillés.
- **Gestion des Devis**: Créer et gérer des devis pour des clients potentiels.
- **Gestion des Tâches**: Suivre les tâches avec un statut de complétion.
- **Gestion des Documents**: Télécharger, visualiser et gérer des documents professionnels.
- **Informations de l'Entreprise**: Mettre à jour et visualiser les détails de l'entreprise.
- **Suivi des Revenus**: Surveiller les revenus mensuels et annuels.
- **Suivi des Paiements**: Enregistrer et gérer les paiements reçus.
- **Fonctionnalité de Recherche**: Trouver rapidement des clients, factures, devis, tâches et documents.
- **Design Responsive**: Accessible sur divers appareils.
- **Thème Sombre/Clair**: Personnaliser l'apparence selon vos préférences.

## Technologies Utilisées

- **Frontend**:

  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - Framer Motion
  - Lucide React
  - Axios

- **Backend**:

  - Node.js
  - TypeScript
  - Express
  - MySQL2
  - Multer
  - dotenv
  - morgan
  - ts-node-dev

- **Génération de PDF**:
  - jsPDF
  - html2canvas

## Structure du Projet

```
freelancebox-kris/
├── backend/
│   ├── .env
│   ├── package.json
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── clientController.ts
│   │   │   ├── companyController.ts
│   │   │   ├── documentController.ts
│   │   │   ├── invoiceController.ts
│   │   │   ├── paymentController.ts
│   │   │   └── quoteController.ts
│   │   ├── routes/
│   │   │   ├── clientRoutes.ts
│   │   │   ├── companyRoutes.ts
│   │   │   ├── documentRoutes.ts
│   │   │   ├── invoiceRoutes.ts
│   │   │   ├── paymentRoutes.ts
│   │   │   ├── quoteRoutes.ts
│   │   │   ├── revenueRoutes.ts
│   │   │   └── taskRoutes.ts
│   │   └── server.ts
│   └── tsconfig.json
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── forms/
│   │   │   ├── ClientForm.tsx
│   │   │   ├── CompanyForm.tsx
│   │   │   ├── DocumentForm.tsx
│   │   │   ├── InvoiceForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── TaskForm.tsx
│   │   ├── GlobalSearch.tsx
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   └── Navigation.tsx
│   │   └── PDFViewer.tsx
│   ├── mocks/
│   │   └── mockData.ts
│   ├── pages/
│   │   ├── ClientDetailsPage.tsx
│   │   ├── ClientsPage.tsx
│   │   ├── CompanyPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DocumentsPage.tsx
│   │   ├── InvoicesPage.tsx
│   │   ├── PaymentsPage.tsx
│   │   ├── QuotesPage.tsx
│   │   └── StatisticsPage.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── pdfGenerator.ts
│   ├── styles/
│   │   └── globals.css
│   ├── types/
│   │   ├── database.ts
│   │   └── mysql12.d.ts
│   ├── vite-env.d.ts
│   └── main.tsx
├── tailwind.config.js
├── tsconfig.app.json
└── tsconfig.json
```

## Instructions d'Installation

1. **Cloner le Dépôt**:

   ```bash
   git clone https://github.com/krismos64/kris-freelance-box.git
   cd kris-freelance-box
   ```

2. **Installer les Dépendances**:

   ```bash
   npm install
   ```

3. **Configurer les Variables d'Environnement**:

   - Pour le frontend, créez un fichier `.env` dans le répertoire racine avec le contenu suivant :
     ```
     VITE_API_BASE_URL=http://localhost:5002/api
     ```
   - Pour le backend, créez un fichier `.env` dans le répertoire `backend` avec le contenu suivant :
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_DATABASE=kris_freelancebox
     DB_PORT=3306
     SERVER_PORT=5002
     ```

4. **Démarrer le Serveur Backend**:

   ```bash
   cd backend
   npm run dev
   ```

5. **Démarrer le Serveur de Développement Frontend**:

   ```bash
   cd ..
   npm run dev
   ```

6. **Accéder à l'Application**:
   - Ouvrez votre navigateur et accédez à `http://localhost:5174` pour le frontend.
   - L'API backend sera disponible sur `http://localhost:5002/api`.

## Utilisation

- **Tableau de Bord**: Aperçu des métriques clés et des activités récentes.
- **Clients**: Gérer les informations clients.
- **Factures**: Créer et gérer des factures.
- **Devis**: Créer et gérer des devis.
- **Tâches**: Suivre les tâches avec un statut de complétion.
- **Documents**: Télécharger, visualiser et gérer des documents professionnels.
- **Entreprise**: Mettre à jour et visualiser les détails de l'entreprise.
- **Statistiques**: Surveiller les revenus mensuels et annuels.
- **Paiements**: Enregistrer et gérer les paiements reçus.
- **Recherche**: Trouver rapidement des clients, factures, devis, tâches et documents.

## Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes pour contribuer :

1. Forker le dépôt.
2. Créer une nouvelle branche pour votre fonctionnalité ou correction de bug.
3. Effectuer vos modifications et les commettre.
4. Pousser vos modifications vers votre fork.
5. Créer une pull request vers le dépôt principal.
