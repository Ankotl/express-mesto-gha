const Cards = require('../models/card');
const ErrorNotFound = require('../errors/ErrorNotFound');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constans');

const getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
    });
};

const likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound('Запрашиваемая карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      if (err.statusCode === 404) {
        return res.status(NOT_FOUND).send({ message: err.errorMessage });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
    });
};

const dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new ErrorNotFound('Запрашиваемая карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      if (err.statusCode === 404) {
        return res.status(NOT_FOUND).send({ message: err.errorMessage });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по-умолчанию' });
    });
};

const deleteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new ErrorNotFound('Запрашиваемая карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      if (err.statusCode === 404) {
        return res.status(NOT_FOUND).send({ message: err.errorMessage });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по-умолчанию' });
    });
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};
