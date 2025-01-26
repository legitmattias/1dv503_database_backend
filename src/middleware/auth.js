export const sessions = {} // Simulated session storage.

export const validateSession = (req, res, next) => {
  console.log('Validate session invoked')
  console.log(`Stored session tokens: ${JSON.stringify(sessions, null, 2)}`)
  const sessionToken = req.headers['authorization'] || req.cookies?.sessionToken

  if (!sessionToken || !sessions[sessionToken]) {
    console.log(`Session token: ${sessionToken}`)
    return res.status(401).json({ error: 'Unauthorized' })
  }

  console.log(`Session token: ${sessionToken}`)
  // Attach the user ID from the session to the request object.
  req.userid = sessions[sessionToken]
  console.log('Session cookie validated. User authorized.')
  
  next()
}
