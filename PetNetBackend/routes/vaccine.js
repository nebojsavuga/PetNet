const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { getAll, getVaccineById } = require('../controllers/vaccineController');

router.get('/getAll', authenticate, getAll);
router.get('/:id', authenticate, getVaccineById);

module.exports = router;