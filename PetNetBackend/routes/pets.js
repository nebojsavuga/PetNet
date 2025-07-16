const express = require('express');
const router = express.Router();
const { create, getById, getAll, uploadImageToIpfs, getFamily, createOrUpdateVaccination, createOrUpdateIntervention, createOrUpdateAward } = require('../controllers/petController');
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/multer');

router.post('', authenticate, create);
router.get('/:id', authenticate, getById);
router.get('', authenticate, getAll);
router.get('/family', authenticate, getFamily);
router.post('/image', authenticate, upload.single('image'), uploadImageToIpfs);
router.post('/vaccination', authenticate, createOrUpdateVaccination);
router.post('/intervention', authenticate, createOrUpdateIntervention);
router.post('/award', authenticate, createOrUpdateAward);

module.exports = router;