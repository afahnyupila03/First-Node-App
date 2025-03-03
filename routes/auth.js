const express = require('express')
const router = express.Router()

const { check, body } = require('express-validator')

const authController = require('../controllers/auth')
const User = require('../models/user')

router.get('/login', authController.getLogin)
router.get('/signup', authController.getSignup)
router.post('/login', authController.postLogin)
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter valid email.')
      //   Check if user email already exist.
      .custom(async (value, { req }) => {
        // if (value === 'test@test.com')
        //   throw new Error('This email address is forbidden')
        // return true

        // Find existing user by email.
        const userDoc = await User.findOne({ email: value })
        if (userDoc) {
          throw new Error('E-Mail exist already, please pick another E-Mail')
        }
      }),
    //   Password validator.
    body(
      'password',
      'Please enter a password with only numbers, text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    // Check if password and confirm-password is a match.
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Passwords do not match')
      return true
    })
  ],
  authController.postSignup
)
router.post('/logout', authController.postLogout)
router.get('/reset-password', authController.getResetPassword)
router.post('/reset-password', authController.postReset)
// Since post reset-password send a dynamic value of token, hence:
router.get('/reset-password/:token', authController.getNewPassword)
router.post('/new-password', authController.postNewPassword)

module.exports = router
