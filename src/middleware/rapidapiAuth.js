module.exports = function rapidapiAuth(req, res, next) {
  // ✅ Allow bypass in development
  if (process.env.NODE_ENV !== 'production') {
    return next()
  }

  const key = req.headers['x-rapidapi-key']

  if (!key) {
    return res.status(403).json({
      success: false,
      error: 'Missing RapidAPI key'
    })
  }

  next()
}
