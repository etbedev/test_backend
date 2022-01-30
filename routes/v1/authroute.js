const express = require('express');
const router = express.Router();

const {register, login, refreshToken, uploadFiles} = require('../../controller /authController');
const { uploadFile } = require('../../utils/imageupload');
router.post('/register', uploadFile.single('image'),register)
router.post('/login', login)
router.post('/refresh_token', refreshToken)

module.exports = router;
