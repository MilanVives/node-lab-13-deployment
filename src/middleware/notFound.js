const { NotFoundError } = require('../errors');

function notFound(req, res, next) {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
}

module.exports = notFound;
