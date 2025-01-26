const sessions = {} // Simulated session storage.

export const validateSession = (req, res, next) => {
  const sessionToken = req.headers['authorization'] || req.cookies?.sessionToken

  if (!sessionToken || !sessions[sessionToken]) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Attach the user ID from the session to the request object.
  req.userid = sessions[sessionToken]
  console.log('Session cookie validated. User authorized.')
  
  next()
}
