function requiereSesion(req, res, next) {
  if (req.session && req.session.nombreUsuario) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = requiereSesion;