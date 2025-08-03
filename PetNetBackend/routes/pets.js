const express = require('express');
const router = express.Router();
const {
    create,
    getById,
    getAll,
    uploadImageToIpfs,
    getFamily,
    createOrUpdateVaccination,
    createOrUpdateIntervention,
    createOrUpdateAward,
    addTemporaryParent,
    deleteParent,
    addExistingParent,
    addExistingChild,
    deleteChild,
    addOrUpdateVaccination,
    uploadPdfToIpfs,
    getPetInterventionReports
} = require('../controllers/petController');
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
router.post('/:id/add-temporary-parent', authenticate, addTemporaryParent);
router.delete('/:petId/deleteParent/:parentId', authenticate, deleteParent);
router.delete('/:petId/deleteChild/:childId', authenticate, deleteChild);
router.post('/:id/assign-existing-parent/:parentId', authenticate, addExistingParent);
router.post('/:id/assign-existing-child/:childId', authenticate, addExistingChild);
router.post('/:petId/add-vaccination', authenticate, addOrUpdateVaccination);
router.post('/upload-pdf', upload.single('file'), uploadPdfToIpfs);
router.get('/getInterventionReports/:id', authenticate, getPetInterventionReports);


module.exports = router;