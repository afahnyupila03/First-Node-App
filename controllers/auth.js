const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
  // console.log('headers: ', req.get('Cookie').split(';')[2].trim().split('=')[1])

  // Cookie value
  const isLoggedIn = req.get('Cookie')
  // .split(';')[2].trim().split('=')[1]

  res.render('auth/login', {
    pageTitle: 'Auth',
    path: '/login',
    isAuthenticated: req.session.isLoggedIn
  })
}

exports.getSignup = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie')
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    isAuthenticated: req.session.isLoggedIn
  })
}

exports.postLogin = (req, res, next) => {
  // Using the email to find user in db.
  const email = req.body.email
  const password = req.body.password
  // using the session middleware from  app.js
  User.findOne({ email: email })
    .then(user => {
      if (!user) res.redirect('/login')

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

exports.postLogout = (req, res, next) => {
  // Deleting session storage in MongoDB.
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  // Find existing user by email.
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) res.redirect('/signup')

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
        .then(() => res.redirect('/login'))
    })
    .catch(err => console.log(err))
}
