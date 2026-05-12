const jwt = require('jsonwebtoken');

// Fallback secret is a code smell — if JWT_SECRET is not set the app
// will still sign and verify tokens with a predictable value.
const SECRET = process.env.JWT_SECRET || 'dev-secret';

function authenticate(req, res, next) {
  // Deliberate bug: no null-check on the authorization header.
  // If the header is missing, `.split` throws and crashes the request.
  const token = req.headers.authorization.split(' ')[1];

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: 'invalid token' });
  }
}

module.exports = authenticate;
module.exports.SECRET = SECRET;
