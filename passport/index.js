const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models'); // 정리 필요

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.find({ where : { id } })
      .then(user => done(null, user))
      .catch( err => done(err));
  });

  // local(passport);
  // kakao(passport);
};

