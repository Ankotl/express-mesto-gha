const { ERROR_CODE_UNAUTHORIZED } = require('../constans');

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_UNAUTHORIZED;
  }
}
module.exports = AuthError;
