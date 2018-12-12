var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/stories', function(req, res, next) {
  res.send();
});

module.exports = router;
