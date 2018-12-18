const express = require('express');
const User = require('../models').User;
const passport = require('passport');
const bcrypt = require('bcrypt');
const { loggedin, notloggedin } = require('./middlewares');

const router = express.Router();

// 회원가입
router.post('/signup', notloggedin, async (req, res, next) => {
  const { id, password, email } = req.body;
  try {
    const signedUser = await User.find({ where: { id } });
    if (signedUser) {
      req.flash('signupError', '이미 사용중인 아이디입니다.');
      res.json('이미 사용중인 아이디');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      id, password: hash, email
    });
    return res.json('가입 완료');
  } catch(error) {
    console.error(error);
    return next(error);
  }
});

// 로그인
router.post('/login', notloggedin, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.json('로그인 에러');
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.json('로그인 성공');
    });
  })(req, res, next);
});

// 로그아웃
router.get('/logout', loggedin, (req, res) => {
  req.logout();
  req.session.destroy();
  res.json('로그아웃 성공');
});

// 소셜 로그인
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',  
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
