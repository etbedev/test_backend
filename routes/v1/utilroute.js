const express = require('express');
const { uploadFiles } = require('../../controller /utilController');
const {uploadFile} = require('../../utils/imageupload');
const router = express.Router();


router.post('/image', uploadFile.single('image'),uploadFiles)

module.exports = router;
