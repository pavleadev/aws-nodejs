const express = require('express');
const router = express.Router();

router.use('', require('../modules/user/userRoutes'));

router.all('/*', (req, res) => {
  return res.status(404).send({ error: 'Data not found' });
})

module.exports = router;