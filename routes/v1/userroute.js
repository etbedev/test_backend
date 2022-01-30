const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');

const {finduser, updateUser, deleteUser} = require('../../controller /userController');
const { uploadFile } = require('../../utils/imageupload');

router.get('/', authenticate({}), finduser)
router.delete('/usr/:id', authenticate({}), deleteUser)
router.put('/:id', uploadFile.single('image'),authenticate({}), updateUser)

module.exports = router;
