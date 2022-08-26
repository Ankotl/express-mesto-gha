const { ERROR_CODE_INTERNAL_SERVER_ERROR } = require('../constans');

module.exports = (err, req, res, next) => {
  const { statusCode = ERROR_CODE_INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message: statusCode === ERROR_CODE_INTERNAL_SERVER_ERROR ? 'Внутренняя ошибка сервера' : message,
  });
  next();
};
