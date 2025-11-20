const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const {
  validateUpdateUser,
  validateUpdateAvatar,
  validateUserIdParam,
} = require('../middlewares/validations');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserIdParam, getUserById);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
