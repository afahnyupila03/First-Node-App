const { Schema, default: mongoose } = require('mongoose')
// const product = require('./product')

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product', // Refer to product model, hence creating relation.
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
})  


userSchema.methods.addToCart = function (product) {
  // Do not use arrow functions on mongoose methods.
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString()
  })
  let newQuantity = 1
  const updatedCartItems = [...this.cart.items]

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1
    updatedCartItems[cartProductIndex].quantity = newQuantity
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    })
  }
  const updatedCart = {
    items: updatedCartItems
  }
  this.cart = updatedCart

  return this.save()
}

userSchema.methods.removeFromCart = function (productId) {
  // Filters for the cart items to be deleted by id.
  const updatedCartItems = this.cart.items.filter(p => {
    return p.productId.toString() !== productId.toString()
  })

  this.cart.items = updatedCartItems
  // Saves the new state of the cart.items.
  return this.save() //
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save()
}

module.exports = mongoose.model('User', userSchema)


//   addOrder () {
//     const db = getDb()
//     // Get more infor about product added to cart.
//     return this.getCart()
//       .then(products => {
//         // To store product to cart, relate it to the user.
//         const order = {
//           items: products,
//           user: {
//             _id: ObjectId.createFromHexString(this._id),
//             name: this.nme
//             // email: this.email
//           }
//         }
//         return db.collection('orders').insertOne(order)
//       })
//       .then(() => {
//         // After succeeding in creating order, empty cart.
//         this.cart = { items: [] }
//         // Clear cart also in db.
//         return db.collection('users').updateOne(
//           { _id: ObjectId.createFromHexString(this._id) },
//           {
//             $set: {
//               cart: []
//             }
//           }
//         )
//       })
//   }

//   getOrders () {
//     const db = getDb()
//     return (
//       db
//         .collection('orders')
//         // To return an array of orders for the user.
//         .find({ 'user._id': ObjectId.createFromHexString(this._id) })
//         .toArray()
//     )
//   }

// // // const Sequelize = require('sequelize')
// // // const sequelize = require('../config/db')

// const { ObjectId } = require('mongodb')
// const { getDb } = require('../config/mongo.db')

// // // const User = sequelize.define('user', {
// // //   id: {
// // //     type: Sequelize.INTEGER,
// // //     allowNull: false,
// // //     primaryKey: true,
// // //     // autoGenerate: true
// // //     // autoIncrement: true
// // //   },
// // //   email: {
// // //     type: Sequelize.STRING,
// // //     allowNull: false,
// // //     // unique: true
// // //   },
// // //   name: {
// // //     type: Sequelize.STRING,
// // //     allowNull: false
// // //   }
// // // })

// class User {
//   constructor (email, name, userId, cart) {
//     this.email = email
//     this.name = name
//     this._id = userId
//     this.cart = cart || { items: [] } // should look something like this => { items: [] }
//   }

//   save () {
//     const db = getDb()

//     return db.collection('users').insertOne(this)
//   }

//   // Method to add user-cart to user association.

//   addToCart (product) {
//     if (!this.cart) {
//       this.cart = { items: [] } // Initialize cart if it's undefined
//     }

//     if (!this.cart.items) {
//       this.cart.items = [] // Ensure items array exists
//     }

//     const db = getDb()
//     // Check if product already exist in cart..
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString()
//     })

//     let newQuantity = 1
//     const updatedCartItems = [...this.cart.items]

//     // Condition to see if product exist.
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1
//       updatedCartItems[cartProductIndex].quantity = newQuantity
//     } else {
//       updatedCartItems.push({
//         productId: ObjectId.createFromHexString(product._id),
//         quantity: newQuantity
//       })
//     }

//     const updatedCart = {
//       items: updatedCartItems
//     }
//     // Update user to store cart.
//     // Add product to cart
//     return db.collection('users').updateOne(
//       { _id: ObjectId.createFromHexString(this._id) },
//       {
//         $set: {
//           cart: updatedCart
//         }
//       }
//     )
//   }

//   getCart () {
//     const db = getDb()
//     const productIds = this.cart.items.map(i => i.productId).toArray()
//     return db
//       .collection('products')
//       .find(
//         // Returns an array of product ids that hold references to all product-ids found in cart.
//         { _id: { $in: productIds } }
//       )
//       .then(products =>
//         // Transform the products array from database.
//         products.map(p => {
//           return {
//             ...p,
//             // To get right qty for product,
//             // access cart.items which exist on the said user.
//             quantity: this.cart.items.find(
//               i => i.productId.toString() === p._id.toString()
//             ).quantity
//           }
//         })
//       )
//   }

//   deleteCart (productId) {
//     const updatedCartItems = this.cart.items.filter(
//       p => p.productId.toString() !== productId.toString()
//     )

//     const db = getDb()
//     return db.collection(
//       'users'.updateOne(
//         { _id: ObjectId.createFromHexString(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       )
//     )
//   }

//   addOrder () {
//     const db = getDb()
//     // Get more infor about product added to cart.
//     return this.getCart()
//       .then(products => {
//         // To store product to cart, relate it to the user.
//         const order = {
//           items: products,
//           user: {
//             _id: ObjectId.createFromHexString(this._id),
//             name: this.nme
//             // email: this.email
//           }
//         }
//         return db.collection('orders').insertOne(order)
//       })
//       .then(() => {
//         // After succeeding in creating order, empty cart.
//         this.cart = { items: [] }
//         // Clear cart also in db.
//         return db.collection('users').updateOne(
//           { _id: ObjectId.createFromHexString(this._id) },
//           {
//             $set: {
//               cart: []
//             }
//           }
//         )
//       })
//   }

//   getOrders () {
//     const db = getDb()
//     return (
//       db
//         .collection('orders')
//         // To return an array of orders for the user.
//         .find({ 'user._id': ObjectId.createFromHexString(this._id) })
//         .toArray()
//     )
//   }

//   static findUserById (userId) {
//     const db = getDb()
//     const id = ObjectId.createFromHexString(userId)
//     return db
//       .collection('users')
//       .findOne({ _id: id })
//       .then(user => {
//         console.log('usr model user: ', user)
//         return user
//       })
//       .catch(err => console.log(err))
//   }
// }

// module.exports = User
