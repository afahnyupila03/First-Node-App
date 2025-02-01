// const mongoose = require('mongoose')

const { Schema, default: mongoose } = require('mongoose')

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Refer to user model, hence creating relation.
    required: true
  }
})

module.exports = mongoose.model('Product', productSchema)

// // const Sequelize = require('sequelize')
// const { ObjectId } = require('mongodb')
// const { getDb } = require('../config/mongo.db')

// // Import the export database connection established in config/db.js.
// // const sequelize = require('../config/db')

// // Product model:
// // const Product = sequelize.define('product', {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true
// //   },
// //   title: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   },
// //   price: {
// //     type: Sequelize.DOUBLE,
// //     allowNull: false
// //   },
// //   imageUrl: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   },
// //   description: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   }
// // })

// class Product {
//   constructor (title, price, description, imageUrl, id, userId) {
//     this.title = title
//     this.price = price
//     this.description = description
//     this.imageUrl = imageUrl
//     // Check if id exist, if not, set value to null.
//     this._id = id ?  new ObjectId(id) : null // To be used in case of updating/deleting a product.
//     this.userId = userId // Associates ech product created to the user who inserted the product.
//   }

//   save () {
//     const db = getDb()
//     let dbOp
//     if (this._id) {
//       // if product exist, update product.
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: this._id }, { $set: this })
//     } else {
//       // If no product with id,create a new product.
//       dbOp = db.collection('products').insertOne(this)
//     }
//     return dbOp
//       .then(result => console.log(result))
//       .catch(err => console.log(err))
//     // {
//     //   title: this.title,
//     //   price: this.price,
//     //   description: this.description
//     // }
//   }

//   static fetchAll () {
//     const db = getDb()
//     return (
//       db
//         .collection('products')
//         // find() provides a handle for fetching querying data.
//         .find()
//         // Converts the queried data into an array.
//         .toArray()
//         .then(products => {
//           // console.log(products)
//           return products
//         })
//         .catch(err => console.log(err))
//     )
//   }

//   static fetchProduct (id) {
//     const db = getDb()
//     return (
//       db
//         .collection('products')
//         // Methods returns a cursor
//         .findOne({ _id: ObjectId.createFromHexString(id) })
//         // Used to fetch the next document returned.
//         .then(product => {
//           console.log('Mongo single product: ', product)
//           return product
//         })
//         .catch(err => console.log(err))
//     )
//   }

//   static deleteById (id) {
//     const db = getDb()
//     return db
//       .collection('products')
//       .deleteOne({ _id: ObjectId.createFromHexString(id) })
//       .then(() => console.log('Product delete success...!!!'))
//       .catch(err => console.log(err))
//   }
// }

// module.exports = Product
