const router = require('express').Router()

const PetController = require('../controllers/PetController')

const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

router.post('/create', verifyToken, imageUpload.array('images', 5), Petcontroller.create)
router.post('/schudule/:id', verifyToken, PetController.schudule)
router.post('/concludeAdoptions/:id', verifyToken, PetController.concludeAdoptions)

router.get('/:id', PetController.getPetById)
router.get('/getall', PetController.getAll)
router.get('/getAllUsersPets', verifyToken, PetController.getAllUsersPets)
router.get('/getAllUsersAdoptions', verifyToken, PetController.getAllUsersAdoptions)

router.patch('/:id', verifyToken, imageUpload.array('image', 5), PetController.updatePet)
router.delete('/:id', verifyToken, PetController.removePetById)

module.exports = router