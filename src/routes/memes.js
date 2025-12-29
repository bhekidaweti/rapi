const express = require('express')
const supabase = require('./../db/supabase')
const rapidapiAuth = require('./../middleware/rapidapiAuth')

const router = express.Router()

router.get('/', rapidapiAuth, async (req, res) => {
  const {
    subreddit,
    limit = 20,
    min_upvotes = 0
  } = req.query
  

  let query = supabase
    .from('scraped_memes')
    .select('title, image_url, subreddit, reddit_username, upvotes, created_at')
    .gte('upvotes', min_upvotes)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (subreddit) {
    query = query.eq('subreddit', subreddit)
  }

  const { data, error } = await query

  if (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch memes'
    })
  }

  res.json({
    success: true,
    count: data.length,
    source: 'reddit',
    data
  })
})

module.exports = router
