# Reddit Meme API

A simple REST API that scrapes memes from Reddit (`r/memes`, `r/dankmemes`, `r/ProgrammerHumor`) and serves them as JSON.  

✅ **Includes:**  
- Meme title, image URL, subreddit, Reddit username (poster), upvotes, comment count, NSFW flag, Reddit post URL, and timestamp  
- RapidAPI authentication support (`x-rapidapi-key`)  
- Cron-based auto-scraping (every 30 minutes)  
- Optional query filters: `subreddit`, `limit`, `min_upvotes`  

---

## Base URL




---

## Endpoints

### `GET /api/memes`

Fetch memes from the database.

**Query Parameters:**

| Parameter       | Type    | Optional | Description |
|-----------------|---------|----------|-------------|
| `subreddit`     | string  | ✅       | Filter by subreddit (e.g., `memes`) |
| `limit`         | integer | ✅       | Number of memes to return (default `20`) |
| `min_upvotes`   | integer | ✅       | Minimum number of upvotes (default `0`) |

**Headers:**

```http
x-rapidapi-key: <YOUR_RAPIDAPI_KEY>

Sample Response:

{
  "success": true,
  "count": 2,
  "source": "reddit",
  "data": [
    {
      "title": "Happy new year!",
      "image_url": "https://i.redd.it/gs7ytqtl7u9g1.jpeg",
      "subreddit": "memes",
      "reddit_username": "u/L",
      "upvotes": 1234,
      "comments_count": 56,
      "nsfw": false,
      "reddit_post_url": "https://reddit.com/r/memes/...",
      "created_utc": "2025-12-28T16:56:34.137Z"
    }
  ]
}

