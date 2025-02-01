const express = require('express')
const router = express.Router()

// // const path = require('path')

const adminControllers = require('../controllers/admin')

// // const rootDir = require('../util/path')

// /admin/add-product => GET
router.get('/admin/add-product', adminControllers.getAddProduct)
router.get('/admin/products', adminControllers.getProducts)
// /admin/product => POST
router.post('/add-product', adminControllers.postAddProduct)
// Using query params
router.get('/admin/edit-product/:productId', adminControllers.getEditProduct)
router.post('/admin/edit-product', adminControllers.postEditProduct)
router.post('/admin/delete-product', adminControllers.postDeleteProduct)

module.exports = router
