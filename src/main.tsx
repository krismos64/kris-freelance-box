import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";

async function initializeApp() {
  try {
    // Test de connexion via un appel à l'API
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/health`
    );
    console.log("Connexion à l'API réussie:", response.data.status);
  } catch (error) {
    console.error("Erreur de connexion à l'API:", error);
  }

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

initializeApp();
