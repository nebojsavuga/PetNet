const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { getAll, getVaccineById, getVaccineByIdWeb } = require('../controllers/vaccineController');

router.get('/getAll', authenticate, getAll);
router.get('/:id', authenticate, getVaccineById);

router.get('/getById/:id', getVaccineByIdWeb);

module.exports = router;