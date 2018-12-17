exports.loggedin = (req, res, next) => {
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.notloggedin = (req, res, next) => {
  const isAuthenticated = req.isAuthenticated();
  if (!isAuthenticated) {
    next();
  } else {
    res.redirect('/');
  }
};