const Card = require('../models/card');

const FORBIDDEN = 403;
const NOT_FOUND = 404;

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.json(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).json(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      const error = new Error('ID do card não encontrado');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        const error = new Error('Você não pode deletar cards de outros usuários');
        error.statusCode = FORBIDDEN;
        throw error;
      }

      return card.deleteOne().then(() => res.json(card));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('ID do card não encontrado');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((card) => res.json(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('ID do card não encontrado');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((card) => res.json(card))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
