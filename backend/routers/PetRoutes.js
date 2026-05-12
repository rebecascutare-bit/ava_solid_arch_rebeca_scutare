const router = require('express').Router()

const PetController = require('../controllers/PetController')

const verifyToken = require('../helpers/verify/PetController')
const { imageUpload } = requiew('../helpers/image-upload')


router.post('/create' , verifyToken, imageUpload.array('imagens'), PetController.create)

router.get('/', PetConttroller.getAll)


router.get('/mypets', verifyToken, PetController.getAllUserPets)
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)

router.patch('/:id' , PetController.getPetById)
router.delete('/:id', verifyToken, PetController.removePetById)


router.patch('/:id' , verifyToken, imageUpload.array('images', PetController.updatePet))

router.patch('/schedule/:id', verifyToken, PetController.schedule)
router.patch('/conclude:id', verifyToken, PetController.concludeAdoption)

module.exports = router
