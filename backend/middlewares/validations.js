const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const signupBody = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().custom(validateURL),
});

const signinBody = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

const updateUserBody = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  about: Joi.string().required().min(2).max(30),
});

const updateAvatarBody = Joi.object().keys({
  avatar: Joi.string().required().custom(validateURL),
});

const cardBody = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  link: Joi.string().required().custom(validateURL),
});

const userIdParam = Joi.object().keys({
  userId: Joi.string().required().hex().length(24),
});

const cardIdParam = Joi.object().keys({
  cardId: Joi.string().required().hex().length(24),
});

module.exports = {
  validateSignup: celebrate({ [Segments.BODY]: signupBody }),
  validateSignin: celebrate({ [Segments.BODY]: signinBody }),
  validateUpdateUser: celebrate({ [Segments.BODY]: updateUserBody }),
  validateUpdateAvatar: celebrate({ [Segments.BODY]: updateAvatarBody }),
  validateCardCreation: celebrate({ [Segments.BODY]: cardBody }),
  validateUserIdParam: celebrate({ [Segments.PARAMS]: userIdParam }),
  validateCardIdParam: celebrate({ [Segments.PARAMS]: cardIdParam }),
};
