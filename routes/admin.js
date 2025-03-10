const express = require('express')
const router = express.Router()

// // const path = require('path')

const adminControllers = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

// // const rootDir = require('../util/path')

// /admin/add-product => GET
router.get('/admin/add-product', isAuth, adminControllers.getAddProduct)
router.get('/admin/products', isAuth, adminControllers.getProducts)
// /admin/product => POST
router.post('/add-product', adminControllers.postAddProduct)
// Using query params
router.get(
  '/admin/edit-product/:productId',
  isAuth, 
  adminControllers.getEditProduct
)
router.post('/admin/edit-product', isAuth, adminControllers.postEditProduct)
router.delete('/product/:productId', isAuth, adminControllers.deleteProduct)

module.exports = router
