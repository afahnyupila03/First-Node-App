const User = require('../models/user')

const crypto = require('crypto') // to generate node token.
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendGrid = require('nodemailer-sendgrid-transport')

// Init nodemailer transporter.
const transport = nodemailer.createTransport(
  sendGrid({
    auth: {
      api_key:
        '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'
    }
  })
)

exports.getLogin = (req, res, next) => {
  // Since req.flash('error') is an empty array.
  // Extract the message from the empty array.
  let message = req.flash('error') // Access the error message with the key used in the postLogin controller.
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/login', {
    pageTitle: 'Auth',
    path: '/login',
    errorMessage: message
  })
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error') // Access the error message with the key used in the postLogin controller.
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: message
  })
}

exports.postLogin = (req, res, next) => {
  // Using the email to find user in db.
  const email = req.body.email
  const password = req.body.password
  // using the session middleware from  app.js
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password')
        return res.redirect('/login')
      }

      // validating user password (comparing existing & incoming passwords)
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          // Check if user enters matching password.
          if (doMatch) {
            req.session.isLoggedIn = true // Setting the session value if user password match.
            // Creates a user based on data stored in mongodb.
            req.session.user = user
            // Redirect only when the session is created and saved.
            return req.session.save(err => {
              console.log(err)
              res.redirect('/')
            })
          }
          res.redirect('/login') // If password doesn't match, redirect user to login view.
        })
        .catch(err => {
          console.log(err)
          res.redirect('/login')
        })
    })
    .catch(err => console.log(err))
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  // Find existing user by email.
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-Mail exist already, please pick another E-Mail')
        res.redirect('/signup')
      }

      // Using the bcrypt package for hashing passwords.
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          })
          return user.save()
        })
        .then(() => {
          res.redirect('/login')
          // On successful signup, send user an email.
          // This returns a promise so do as you please...
          return transport.sendMail({
            to: email, // Client's email
            from: 'pila.afahnyu@zingersystems.com', // Sender's email
            subject: 'Email Verification',
            html: '<h1>Successful signed up.</h1>'
          })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
  // Deleting session storage in MongoDB.
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}

exports.getResetPassword = (req, res, next) => {
  let message = req.flash('error') // Access the error message with the key used in the postLogin controller.
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset-password',
    errorMessage: message
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log('crypto randombytes err: ', err)
      res.redirect('/reset')
    }
    // Store token from buffer to string.
    const token = buffer.toString('hex')
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with email found.')
          return res.redirect('/reset-password')
        }
        // Store the generated token in the user resetToken in user model.
        user.resetToken = token
        // Set token expiration time to 1hr from the time the token was generated.
        user.resetTokenExpiration = Date.now() + 3600000
        // Then proceed to store it to database for the user.
        return user.save()
      })
      .then(result => {
        res.redirect('/')
        transport.sendMail({
          to: req.body.email, // Client's email
          from: 'pila.afahnyu@zingersystems.com', // Sender's email
          subject: 'Password Reset',
          html: `
        <p>You requested a password reset.</p>
        <p>Click this <a href='http://localhost:3100/reset-password/${token}'>link</a> to set a new password.</p>
        `
        })
      })
      .catch(err => console.log(err))
  })
}

exports.getNewPassword = (req, res, next) => {
  // Check if user for token exist(token created using post-reset-password).
  const token = req.params.token
  // Find user by token and make check if token is still valid.
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() } // Ensure token is not expired.
  })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid or expired token')
        return res.redirect('/login') // Redirect if token is invalid
      }

      // Only when user exist / is found do we render the new-password page.
      let message = req.flash('error') // Access the error message with the key used in the postLogin controller.
      if (message.length > 0) {
        message = message[0]
      } else {
        message = null
      }

      res.render('auth/new-password', {
        pageTitle: 'New Password',
        path: '/new-password',
        errorMessage: message,
        // Include user id during post req to update password.
        userId: user._id.toString(),
        passwordToken: token
      })
    })
    .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password
  const userId = req.body.userId
  const token = req.body.passwordToken

  let resetUser // For global access of user var across then chains.

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user
      return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword
      resetUser.resetToken = undefined
      resetUser.resetTokenExpiration = undefined

      return resetUser.save()
    })
    .then(() => res.redirect('/login'))
    .catch(err => console.log(err))
}
