const express = require('express');
const router = express.Router();


router.get('/goodbye', (req, res) => {
    res.send('Goodbye from /api/goodbye!');
  });

  module.exports = router;
  