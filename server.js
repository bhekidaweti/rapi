require('dotenv').config()
const app = require('./src/app')
const scrapeMemes = require('./src/services/redditScrapper')
const cron = require('node-cron')

const PORT = process.env.PORT || 5000

cron.schedule('*/30 * * * *', scrapeMemes)

app.listen(PORT, () => {
  console.log(`🚀 Meme API running on port ${PORT}`)
})
