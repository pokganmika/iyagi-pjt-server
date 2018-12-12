const express = require('express');
const cors = require('cors');
const url = require('url');
const router = express.Router();

router.use(async (req, res, next) => {
  const domain = await domain.find({
    where: { host: url.parse(req.get('origin')).host },
  });

  if (domain) {
    cors({ origin: req.get('origin') })(req, res, next);
  } else {
    next();
  }
});


router.get('/', function(req, res, next) {
  res.send();
});


module.exports = router;

