const Users = require('../models/user');
const ErrorNotFound = require('../errors/ErrorNotFound');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constans');

const getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' }));
};

const getUser = (req, res) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      throw new ErrorNotFound('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
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

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ErrorNotFound('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      if (err.statusCode === 404) {
        return res.status(NOT_FOUND).send({ message: err.errorMessage });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ErrorNotFound('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      if (err.statusCode === 404) {
        return res.status(NOT_FOUND).send({ message: err.errorMessage });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
};
