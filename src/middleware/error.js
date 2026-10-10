const { AppError } = require('../errors');

function errorMiddleware(err, req, res, next) {
  console.error(err);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = statusCode === 500 && !isDevelopment ? 'Something went wrong.' : err.message;
  res.status(statusCode).json({ error: { message, ...(isDevelopment ? { stack: err.stack } : {}) } });
}

module.exports = errorMiddleware;
