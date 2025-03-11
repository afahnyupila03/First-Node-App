// // const path = require('path')

const express = require('express')
const router = express.Router()

// // const rootDir = require('../util/path')
// // const adminData = require('./admin')

const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

// // When dealing with dynamic routes, place the more specific routes before dynamic routes.
// // This is because, the code executes from top to bottom,
// // And the specific route below the dynamic route may never execute.

router.get('/', shopController.getIndex)
router.get('/products', shopController.getProducts)
router.get('/products/:productId', shopController.getProduct)
router.get('/cart', isAuth, shopController.getCart)
router.post('/cart', isAuth, shopController.postCart)
router.get('/orders', isAuth, shopController.getOrders)
router.get('/orders/:orderId', isAuth, shopController.getOrders)
router.get('/checkout', isAuth, shopController.getCheckout)
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteItem)
router.post('/create-order', isAuth, shopController.postOrders)

module.exports = router
