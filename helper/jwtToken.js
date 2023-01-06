const jwt = require('jsonwebtoken')

module.exports = {
  issueAdmin(payload) {
    return jwt.sign(
      {
        exp: payload.exp,
        id: payload.id,
        type: payload.type,
      },
      '1212sd2)@31212',
      { algorithm: 'HS512' }
    )
  },
  issue(payload) {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        id: payload,
      },
      '1212sd2)@31212',
    )
  },

  verify(token, callback) {
    try {
      return jwt.verify(token, '1212sd2)@31212', {}, callback)
    } catch (err) {
      return 'error'
    }
  },

  decode(token) {
    const parts = token.split(' ')
    if (parts.length === 2) {
      const scheme = parts[0]
      const credentials = parts[1]
      if (/^Bearer$/i.test(scheme)) {
        return credentials
      }
      return false
    }
    return false
  },
}
