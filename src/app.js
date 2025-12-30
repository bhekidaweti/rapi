const express = require('express')
const cors = require('cors')
const memeRoutes = require('./routes/memes') // make sure file is memes.js
const rateLimit = require('express-rate-limit')

const app = express()

app.use(cors())
app.use(express.json())

// Rate limiting for /api endpoints
app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 60 }))

// Register routes BEFORE 404
app.use('/api/memes', memeRoutes)

// Root endpoint
app.get('/', (_, res) => {
  res.json({ status: 'Reddit Meme API running' })
})

// 404 handler — must come AFTER routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

module.exports = app



