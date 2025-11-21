const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const JWT_KEY = JWT_SECRET || 'dev-secret';
const UNAUTHORIZED = 401;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED).json({ message: 'Autorização requerida' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    return res.status(UNAUTHORIZED).json({ message: 'Autorização requerida' });
  }

  req.user = payload;
  return next();
};
