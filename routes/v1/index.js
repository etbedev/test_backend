const express = require('express');
const router = express.Router();

const userrouter = require('./userroute')
const authRouter = require('./authroute')
const utilroute = require('./utilroute')

router.use('/user', userrouter)
router.use('/auth', authRouter)
router.use('/util', utilroute)

module.exports = router;
