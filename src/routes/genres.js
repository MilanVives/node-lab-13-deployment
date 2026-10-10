const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncHandler = require('../middleware/asyncHandler');
const { NotFoundError, ValidationError } = require('../errors');
const { Genre, validate } = require('../models/genre');

const router = express.Router();
const NOT_FOUND = 'The genre with the given ID was not found.';

function validateOrThrow(body) {
  const { error } = validate(body);
  if (error) throw new ValidationError(error.details[0].message);
}

router.get('/', asyncHandler(async (req, res) => {
  res.send(await Genre.find().sort('name'));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) throw new NotFoundError(NOT_FOUND);
  res.send(genre);
}));

router.post('/', auth, asyncHandler(async (req, res) => {
  validateOrThrow(req.body);
  const genre = await new Genre({ name: req.body.name }).save();
  res.send(genre);
}));

router.put('/:id', auth, asyncHandler(async (req, res) => {
  validateOrThrow(req.body);
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
  if (!genre) throw new NotFoundError(NOT_FOUND);
  res.send(genre);
}));

router.delete('/:id', [auth, admin], asyncHandler(async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) throw new NotFoundError(NOT_FOUND);
  res.send(genre);
}));

module.exports = router;
