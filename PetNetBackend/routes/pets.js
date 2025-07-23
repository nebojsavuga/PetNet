const express = require('express');
const router = express.Router();
const { create, getById, getAll, uploadImageToIpfs, getFamily, createOrUpdateVaccination, createOrUpdateIntervention, createOrUpdateAward } = require('../controllers/petController');
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/multer');

router.post('', authenticate, create);
router.get('/family/:id', authenticate, getFamily);
router.post('/award/:id', authenticate, createOrUpdateAward);
router.get('', authenticate, getAll);
router.post('/image', authenticate, upload.single('image'), uploadImageToIpfs);
router.post('/vaccination', authenticate, createOrUpdateVaccination);
router.post('/intervention', authenticate, createOrUpdateIntervention);
router.get('/:id', authenticate, getById);

module.exports = router;