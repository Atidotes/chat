const jwt = require('jsonwebtoken')

const screen = 'Atidotes'

const JWT = {
  generate(value, expires) {
    return jwt.sign(value, screen, { expiresIn: expires })
  },

  verify(token) {
    try {
      return jwt.verify(token, screen)
    } catch (e) {
      return false
    }
  }
}

module.exports = JWT