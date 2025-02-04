import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";

// Composant de chargement temporaire
const LoadingScreen: React.FC = () => (
  <div className="loading-screen flex items-center justify-center h-screen bg-gray-800 text-white text-xl">
    Chargement en cours...
  </div>
);

async function initializeApp() {
  let apiStatus = false;
  let dbStatus = false;

  try {
    // Vérification de la connexion API
    if (!import.meta.env.VITE_API_BASE_URL) {
      throw new Error(
        "\u26A0\uFE0F  VITE_API_BASE_URL n'est pas d\u00e9fini dans le fichier .env"
      );
    }

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/health`
    );
    console.log("Connexion \u00e0 l'API r\u00e9ussie:", response.data.status);
    apiStatus = true;
  } catch (error) {
    console.error(
      "Erreur de connexion \u00e0 l'API:",
      error instanceof Error ? error.message : String(error)
    );
  }

  try {
    // Vérification de la connexion à la base de données
    const dbResponse = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/test/db`
    );
    console.log(
      "Connexion \u00e0 la base de donn\u00e9es:",
      dbResponse.data.isConnected
    );
    dbStatus = true;
  } catch (error) {
    console.error(
      "Erreur de connexion \u00e0 la base de donn\u00e9es:",
      error instanceof Error ? error.message : String(error)
    );
  }

  if (!apiStatus || !dbStatus) {
    alert(
      "Impossible de se connecter \u00e0 l'API ou \u00e0 la base de donn\u00e9es. Veuillez r\u00e9essayer."
    );
  }

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          {apiStatus && dbStatus ? <App /> : <LoadingScreen />}
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

initializeApp();
