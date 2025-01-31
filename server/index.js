const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')

const app = express()
const PORT = 3001

// Configuration de la connexion MySQL basée sur les variables d'environnement
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kris_freelancebox',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

app.use(cors())
app.use(express.json())

// Route de test de connexion
app.get('/api/test-connection', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result')
    res.json({ connected: true, result: rows[0].result })
  } catch (error) {
    res.status(500).json({ 
      connected: false, 
      error: error.message 
    })
  }
})

// Routes pour récupérer les données
app.get('/api/clients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/tasks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`)
})
