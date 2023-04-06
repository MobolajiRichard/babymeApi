const express = require('express')
const router = express.Router()
const {registerUser} = require('../controllers/userController')
const {handleLogin} = require('../controllers/login')


router.post('/register', registerUser)

router.post('/login', handleLogin)


module.exports = router
