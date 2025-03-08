const { Schema, default: mongoose } = require('mongoose')

const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  user: {
    email: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  }
})

module.exports = mongoose.model('Order', orderSchema)

// const Sequelize = require('sequelize')
// const sequelize = require('../config/db')

// const Order = sequelize.define('order', {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   totalAmount: Sequelize.DOUBLE
// })

// module.exports = Order
