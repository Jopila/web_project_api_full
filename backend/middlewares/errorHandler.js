const { isCelebrateError } = require('celebrate');

const BAD_REQUEST = 400;
const INTERNAL_ERROR = 500;

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || INTERNAL_ERROR;
  let message = err.message || 'Erro interno do servidor';

  if (isCelebrateError(err)) {
    statusCode = BAD_REQUEST;
    message = err.details.values().next().value?.message || 'Dados inválidos';
  } else if (err.name === 'ValidationError') {
    statusCode = BAD_REQUEST;
    message = 'Dados inválidos';
  } else if (err.name === 'CastError') {
    statusCode = BAD_REQUEST;
    message = 'ID inválido';
  }

  if (statusCode === INTERNAL_ERROR) {
    message = 'Erro interno do servidor';
  }

  return res.status(statusCode).json({ message });
};
