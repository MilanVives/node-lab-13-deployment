// Express 5 already forwards rejected promises, but this wrapper makes it explicit
// and works in Express 4 projects too.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
