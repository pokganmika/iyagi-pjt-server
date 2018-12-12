const express = require('express');
const User = require('../models/user');
const router = express.Router();

<<<<<<< HEAD

router.post('/users', async (req, res, next) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    thumbnail: req.body.thumnail,
  });
  await user.save()
=======
router.post('/users', function(req, res, next) {
>>>>>>> 27967b6c1a82827e42be0ddde4e9a8440d17e912

});


module.exports = router;
