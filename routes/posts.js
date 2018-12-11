const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/posts', function(req, res, next) {
  res.send();
});

module.exports = router;