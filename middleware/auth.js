const jwt = require('jsonwebtoken');
const config = require('config');
const middleDebug = require('debug')('app:middle');

const  checkAuthenticated = async (req, res, next) => {
  const token = req.cookies.token || null;
  middleDebug('token:', token);

  try {
    if (!token) {
      res.locals.name = '';
      res.locals.isEditor = false;
      return next();
    } else {
      const decrypt = jwt.verify(token, config.get('db.jwtPrivateKey'));
      middleDebug('data-from-token', decrypt);
      res.locals.user = decrypt;
      res.locals.name = decrypt.name;
      res.locals.isEditor = decrypt.isEditor;
      return next();
    }
  } catch (err) {
    return res.status(500).json(err.toString());
  }
};

function checkNotAuthenticated(req, res, next) {
  const token = req.cookies.token || null;
  if (token) {
    return res.redirect('/');
  }
  next();
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated
};