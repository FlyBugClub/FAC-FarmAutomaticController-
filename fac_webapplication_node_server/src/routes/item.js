const express = require('express');
const router = express.Router();

let items = [];

router.get('/', (req, res) => {
  res.json(items);
});

router.get('/items', (req, res) => {
    itemss = res.json(items);
    items.push(itemss);
})

router.post('/', (req, res) => {
  const item = req.body;
  items.push(item);
  res.status(201).json(item);
});

module.exports = router;
