const router = require('express').Router();

const {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');

const {
  validationCreateCard,
  validationCardId,
} = require('../middlewares/validations');

router.get('/', getCards);
router.post('/', validationCreateCard, createCard);
router.put('/:cardId/likes', validationCardId, likeCard);
router.delete('/:cardId', validationCardId, deleteCard);
router.delete('/:cardId/likes', validationCardId, dislikeCard);

module.exports = router;
