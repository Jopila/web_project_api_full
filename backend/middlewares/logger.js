const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const logsDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const requestLogStream = fs.createWriteStream(path.join(logsDir, 'request.log'), { flags: 'a' });
const errorLogStream = fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' });

const jsonFormat = (tokens, req, res) => JSON.stringify({
  method: tokens.method(req, res),
  url: tokens.url(req, res),
  status: Number(tokens.status(req, res)),
  contentLength: tokens.res(req, res, 'content-length'),
  responseTime: Number(tokens['response-time'](req, res)),
  date: tokens.date(req, res, 'iso'),
});

const requestLogger = morgan(jsonFormat, { stream: requestLogStream });

const errorLogger = (err, req, res, next) => {
  const entry = {
    method: req.method,
    url: req.originalUrl,
    status: err.statusCode || 500,
    message: err.message,
    date: new Date().toISOString(),
  };

  errorLogStream.write(`${JSON.stringify(entry)}\n`);
  next(err);
};

module.exports = {
  requestLogger,
  errorLogger,
};
