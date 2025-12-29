const express = require('express')
const cors = require('cors')
const memeRoutes = require('./routes/memes')

const app = express()

app.use(cors())
app.use(express.json())

const rateLimit = require('express-rate-limit')
app.use('/api', rateLimit({ windowMs: 60*1000, max: 60 }))


app.get('/', (_, res) => {
  res.json({ status: 'Reddit Meme API running' })
})

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})


app.use('/api/memes', memeRoutes)

module.exports = app


