const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;

const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;

const authError = () => {
  const error = new Error("Email ou senha incorretos");
  error.statusCode = UNAUTHORIZED;
  return error;
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error("ID do usuário não encontrado");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.json(user))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("ID do usuário não encontrado");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.json(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
      })
    )
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.code === 11000) {
        err.statusCode = 409;
        err.message = "Email já cadastrado";
      }

      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email e senha são obrigatórios");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw authError();
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw authError();
        }

          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === "production" && JWT_SECRET ? JWT_SECRET : "dev-secret",
            { expiresIn: "7d" }
          );

          return res.json({ token });
      });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("ID do usuário não encontrado");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.json(user))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("ID do usuário não encontrado");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.json(user))
    .catch(next);
};

module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  createUser,
  login,
  updateUser,
  updateAvatar,
};
