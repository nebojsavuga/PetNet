const express = require('express');
const router = express.Router();
const { create, getById, getAll, uploadImageToIpfs } = require('../controllers/petController');
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/multer');

router.post('', authenticate, create);
router.get('/:id', authenticate, getById);
router.get('', authenticate, getAll);
router.post('/image', authenticate, upload.single('image'), uploadImageToIpfs);

module.exports = router;