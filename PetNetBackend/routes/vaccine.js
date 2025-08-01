const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { getAll } = require('../controllers/vaccineController');

router.get('/getAll', authenticate, getAll);

module.exports = router;