const path = require('path')

// Load .env from project root (works no matter where script is run)
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
})

const axios = require('axios')
const supabase = require('../db/supabase')

// --------------------
// Reddit OAuth caching
// --------------------
let cachedToken = null
let tokenExpiry = null

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const auth = Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
  ).toString('base64')

  const params = new URLSearchParams({
    grant_type: 'password',
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
  })

  const { data } = await axios.post(
    'https://www.reddit.com/api/v1/access_token',
    params,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'meme-scraper/1.0 (by u/Lost-Concentrate-661)',
      },
    }
  )

  cachedToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000

  return cachedToken
}

// --------------------
// Main scraper
// --------------------
async function scrapeMemes() {
  console.log('🚀 Starting meme scraping process...')

  const token = await getAccessToken()
  const subreddits = ['memes', 'dankmemes', 'ProgrammerHumor']

  for (const subreddit of subreddits) {
    console.log(`📥 Fetching from r/${subreddit}`)

    const { data } = await axios.get(
      `https://oauth.reddit.com/r/${subreddit}/top?t=day&limit=25`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'meme-scraper/1.0 (by u/Lost-Concentrate-661)',
        },
      }
    )

    for (const post of data.data.children) {
      try {
        const p = post.data
        const image = p.url_overridden_by_dest || p.url

        // Skip non-images
        if (!image || !image.match(/\.(jpeg|jpg|png|gif)$/i)) continue

        // ✅ CORRECT destructuring
        const { error } = await supabase
            .from('scraped_memes')
            .insert({
              reddit_post_id: p.id,
              title: p.title,
              image_url: image,
              subreddit,
              reddit_username: p.author,
              upvotes: p.ups,
              comments_count: p.num_comments,
              nsfw: p.over_18,
              reddit_post_url: `https://reddit.com${p.permalink}`,
              created_utc: new Date(p.created_utc * 1000).toISOString(),
            })


        if (error) {
          // Ignore duplicates gracefully
          if (error.code === '23505') continue
          console.error('❌ Insert failed:', error.message)
        } else {
          console.log(`✅ Saved meme from u/${p.author} (r/${subreddit})`)
        }
      } catch (err) {
        console.error('❌ Post processing error:', err.message)
      }
    }
  }

  console.log('🎉 Scraping run complete')
}

// --------------------
// Allow direct execution
// --------------------
if (require.main === module) {
  scrapeMemes()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Scraping failed:', err)
      process.exit(1)
    })
}

module.exports = scrapeMemes
