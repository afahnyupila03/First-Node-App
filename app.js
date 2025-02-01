const express = require('express')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const path = require('path')
const bodyParser = require('body-parser')

// Using the csurf package to enable csrf protection.
const csrf = require('csurf')

const mongoose = require('mongoose')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const MONGODB_URI =
  'mongodb+srv://fulopila9:9qVjS5mTfmDVn2G2@cluster0.9mx0z.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'

const app = express()
// Configure session to store to MongoDB.
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
// Initialize csrf protection.
const csrfProtection = csrf()

const errorController = require('./controllers/error')
// const { initDb } = require('./config/mongo.db')
// const User = require('./models/user')

// const {ObjectId} = require('mongodb')

// const sequelize = require('./config/db')
// const Product = require('./models/product')
const User = require('./models/user')
// const Cart = require('./models/cart')
// const CartItem = require('./models/cart-item')
// const Order = require('./models/order')
// const OrderItem = require('./models/order-item')

app.set('view engine', 'ejs')
app.set('views', 'views')

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  express.static(path.join(path.dirname(require.main.filename), 'public'))
)
// Initializing user session.
// Session middleware.
app.use(
  session({
    // for the secrete key, use a long string value.
    secret: 'my-secret', // Used for signing the harsh which secretly stores our id in cookie
    resave: false, // ses won't save on every req sent, only when there are changes.
    saveUninitialized: false, // ensures no ses ges saved for req where it doesn't bc nothing was changed.
    store: store // Use the store as a session store.
  })
)
// Using the csrf protection.
app.use(csrfProtection)

app.use((req, res, next) => {
  // using the session middleware from  app.js
  // If no user found in session.
  if (!req.session.user) {
    return next()
  }
  // Find user based on session.
  User.findById(req.session.user._id)
    .then(user => {
      // Create a user based on data stored in session.
      req.user = user // Ensures mongoose methods function.
      next()
    })
    .catch(err => console.log(err))
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn // Makes the isLoggedIn session available in views
  res.locals.csrfToken = req.csrfToken() // Makes csrf tokens available in views.
  next()
})

// Fetch _id string for user collection from mongodb.

// copy user._id string from db.
// const userId = '6793486d5b19b9f7e6f289b0'
// app.use((req, res, next) => {
//   User.findById(userId)
//     .then(user => {
//       req.user = user
//       next()
//     })
//     .catch(err => console.log(err))
// })

// app.use((req, res, next) => {
//   //   User.findOne({ where: { id: userId } })
//   //     .then(user => {
//   //       req.user = user
//   //       next()
//   //     })
//   //     .catch(err => console.log(err))
//   // Using mongodb to create user
//   User.findUserById('679243e455ff9d2b32f93822')
//     .then(user => {
//       req.user = new User(user.email, user.name, user._id, user.cart)
//       console.log('req.user: ', req.user)
//       next()
//     })
//     .catch(err => console.log(err))
// })

app.use(authRoutes)
app.use(adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)
/* DATABASE USING MYSQL */
// Read the associations doc in sequelize.
// Product.belongsTo(User, {
//   constraints: true,
//   onDelete: 'CASCADE' // If user is deleted, product related to user deleted as well.
// })
// User.hasMany(Product)
// // A user has one cart
// User.hasOne(Cart)
// // A cart belongs to a user
// Cart.belongsTo(User)
// // A cart belongs to many products
// Cart.belongsToMany(Product, { through: CartItem })
// // A product belongs to many carts.
// Product.belongsToMany(Cart, { through: CartItem })
// // An order belongs to a user.
// Order.belongsTo(User)
// // A user can then have many orders.
// User.hasMany(Order)
// // An order can belong to many products
// Order.belongsToMany(Product, { through: OrderItem })

// const userId = 1

// sequelize
//   // .sync({
//   //   force: true // Since product table exist, use to enforce table relations.
//   //   // Advised not to use in production so as not override table all the time
//   // })
//   .sync()
//   .then(() => {
//     return User.findOne({
//       where: {
//         id: userId
//       }
//     })
//     // console.log('syn res: ', result)
//     // app.listen(3100)
//   })
//   .then(user => {
//     if (!user) {
//       return User.create({
//         id: 1,
//         name: 'Afah Pila',
//         email: 'pila.afahnyu@gmail.com'
//       })
//     }
//     return user
//   })
//   .then(user => {
//     // console.log(user)
//     return user.createCart()
//   })
//   .then(cart => {
//     app.listen(3100)
//   })
//   .catch(err => console.log('syn err: ', err))

// console.log('Pila')
// app.listen(3100)

// mongoConnect(() => {
//   app.listen(3100)
// })

// initDb((err, db) => {
//   if (err) {
//     console.log('Database initialization failed: ', err)
//     return
//   }

//   console.log('Database ready for use.')
//   app.listen(3100)
// })

// Switch from mongodb queries to mongoose
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3100)
  })
  .catch(err => console.log('mongoose error: ', err))

// app.listen(3100)
