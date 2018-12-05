const express = require('express');
const router = express.Router();

router.use('', require('../modules/user/user'));

router.all('/*', (req, res) => {
  return res.status(400).send({ error: 'Not found' })
})

module.exports = router;