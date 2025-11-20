const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const FORBIDDEN = 403;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(FORBIDDEN).json({ message: 'Autorização requerida' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return res.status(FORBIDDEN).json({ message: 'Autorização requerida' });
  }

  req.user = payload;
  return next();
};
