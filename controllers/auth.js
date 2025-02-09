const User = require('../models/user')

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
