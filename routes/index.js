var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
});

module.exports = router;
