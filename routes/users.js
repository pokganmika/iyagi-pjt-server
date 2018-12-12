const express = require('express');
const User = require('../models/user');
const router = express.Router();


router.post('/users', async (req, res, next) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    thumbnail: req.body.thumnail,
  });
  await user.save()

});


module.exports = router;
