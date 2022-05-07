const jwt = require('jsonwebtoken')

const verifyJwt = (req, res, next) => {
  try {
    const authorization = req.headers.authorization
    const accessToken = authorization.split(" ")[1]
    
    const data = jwt.verify(accessToken, process.env.TOKEN_SECRET)
    req.user = {
      suplier: data.username,
      suplier_email: data.email,
    }
  } catch (err) {
    res.statusCode = 403
    return res.json({ error: 'You are not authorized'})
  }

  next()
}

module.exports = verifyJwt