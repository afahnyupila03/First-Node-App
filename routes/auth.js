const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth')

router.get('/login', authController.getLogin)
router.get('/signup', authController.getSignup)
router.post('/login', authController.postLogin)
router.post('/signup', authController.postSignup)
router.post('/logout', authController.postLogout)
router.get('/reset-password', authController.getResetPassword)
router.post('/reset-password', authController.postReset)
// Since post reset-password send a dynamic value of token, hence:
router.get('/reset-password/:token', authController.getNewPassword) 
router.post('/new-password', authController.postNewPassword)

module.exports = router
