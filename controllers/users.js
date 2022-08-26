const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const ErrorNotFound = require('../errors/ErrorNotFound');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');

const getUsers = (req, res, next) => {
  Users.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      throw new ErrorNotFound('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный _id пользователя.'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    next(new BadRequest('Поля email и password обязательны.'));
  }

  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Передан уже зарегистрированный email.'));
      } else {
        next(err);
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new ErrorNotFound('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при обновлении профиля');
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new ErrorNotFound('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные при обновлении аватара');
      }
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => next(new ErrorNotFound('Пользователь по указанному _id не найден.')))
    .then((user) => res.send(user))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'AntonKotlaykov', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
  getCurrentUser,
  login,
};
