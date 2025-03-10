// mongoose

const Order = require('../models/order')
const Product = require('../models/product')

const ITEMS_PER_PAGE = 2

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1 // if query is undefined always render 1.
  let totalItems
  console.log(totalItems, ITEMS_PER_PAGE)
  console.log('LAST_PAGE: ', Math.ceil(totalItems / ITEMS_PER_PAGE))

  Product.find()
    .countDocuments()
    .then(num => {
      totalItems = num

      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .populate('userId') // Populates the userId field with all data related to the userId key.).catch()
    })
    .then(results => {
      res.render('shop/product-list', {
        prods: results,
        pageTitle: 'All Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      })
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1 // if query is undefined always render 1.
  let totalItems
  console.log(totalItems, ITEMS_PER_PAGE)
  const LAST_PAGE = Math.ceil(totalItems / ITEMS_PER_PAGE)
  console.log('LAST_PAGE: ', LAST_PAGE)

  Product.find()
    .countDocuments()
    .then(num => {
      totalItems = num

      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .populate('userId') // Populates the userId field with all data related to the userId key.).catch()
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      })
    })
    .catch(err => console.log(err))
  // console.log('fetch product controller: ', products)
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId) // Methods used are given by mongoose.
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: 'Product Details',
        path: '/product/:productId',
        product: product
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      console.log('cart product: ', user.cart.items)
      const products = user.cart.items
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      })
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId

  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(() => res.redirect('/cart'))
}

exports.postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId
  console.log('delete product id: ', productId)
  req.session.user
    .removeFromCart(productId)
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err))
}

exports.postOrders = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    // .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } }
      })
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      })
      return order.save()
    })
    .then(result => {
      return req.user.clearCart()
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  // find all orders by userId
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Orders',
        orders: orders
      })
    })
    .catch(err => console.log(err))
}

// const Product = require('../models/product')

// exports.getIndex = (req, res, next) => {
//   Product
//     // Sequel query method.
//     // .findAll()
//     .fetchAll()
//     .then(products => {
//       res.render('shop/index', {
//         prods: products,
//         pageTitle: 'Shop',
//         path: '/'
//         // hasProducts: products.length > 0, // Was used to demonstrate the handlebars module.
//         // activeShop: true // Was used to demonstrate the handlebars module.
//       })
//     })
//     .catch(err => console.log(err))
//   // console.log('fetch product controller: ', products)
// }

// exports.getProducts = (req, res, next) => {
//   Product
//     // Sequel method.
//     // findAll()
//     .fetchAll()
//     .then(results => {
//       res.render('shop/product-list', {
//         prods: results,
//         pageTitle: 'All Products',
//         path: '/products'
//         // hasProducts: products.length > 0, // Was used to demonstrate the handlebars module.
//         // activeShop: true // Was used to demonstrate the handlebars module.
//       })
//     })
//     .catch(err => console.log(err))
//   // console.log('fetch product controller: ', products)
// }

// exports.getProduct = (req, res, next) => {
//   const prodId = req.params.productId
//   Product
//     // Sequel method
//     // .findOne({
//     //   where: {
//     //     id: prodId
//     //   }
//     // })
//     .fetchProduct(prodId)
//     .then(product => {
//       // console.log('mongodb product: ', product)
//       res.render('shop/product-detail', {
//         pageTitle: 'Product Details',
//         path: '/product/:productId',
//         product: product
//       })
//     })
//     .catch(err => console.log(err))
// }

// exports.postCart = (req, res, next) => {
//   const prodId = req.body.productId

//   Product.fetchProduct(prodId)
//     .then(product => {
//       return req.user
//         .addToCart(product)
//         .then(result => {
//           console.log(result)
//           res.redirect('/cart')
//         })
//         .catch(err => console.log('Error add product to cart: ', err))
//     })
//     .catch(err =>
//       console.log('Parent catch container for adding to cart: ', err)
//     )

//     // let fetchedCart
//     // let newQuantity = 1
//     // req.user
//     //   .getCart()
//     //   .then(cart => {
//     //     // check if product already increase in cart
//     //     fetchedCart = cart
//     //     return cart.getProducts({ where: { id: prodId } })
//     //   })
//     //   // Get array of products which will hold at most 1 product/no product
//     //   .then(products => {
//     //     let product
//     //     if (products.length > 0) {
//     //       product = products[0]
//     //     }

//     //     if (product) {
//     //       const oldQuantity = product.cartItem.quantity
//     //       newQuantity = oldQuantity + 1
//     //       return product
//     //     }
//     //     // If not existing product found.
//     //     return Product.findOne({ where: { id: prodId } })
//     //   })
//     //   .then(product =>
//     //     fetchedCart.addProduct(product, {
//     //       through: { quantity: newQuantity }
//     //     })
//     //   )
//     .then(() => res.redirect('/cart'))
//     .catch(err => console.log(err))
// }

// exports.getCart = (req, res, next) => {
//   req.user
//     .getCart()
//     .then(products => {
//       res.render('shop/cart', {
//         path: '/cart',
//         pageTitle: 'Your Cart',
//         products: products
//       })
//     })
//     .catch(err => console.log(err))
// }

// exports.postCartDeleteItem = (req, res, next) => {
//   const productId = req.body.productId
//   req.user
//     .deleteCart(productId)
//     .then(() => res.redirect('/cart'))
//     .catch(err => console.log(err))
//   // .then(cart => {
//   //   return cart.getProducts({ where: { id: productId } })
//   // })
//   // .then(products => {
//   //   let product
//   //   product = products[0]
//   //   return product.cartItem.destroy()
//   // })
//   // .then(() => res.redirect('/cart'))
//   // .catch(err => console.log(err))
//   // Product.findById(productId, product => {
//   //   Cart.deleteProduct(productId, product.price)
//   //   res.redirect('/cart')
//   // })
// }

// // NOT IN USE
// // exports.getCheckout = (req, res, next) => {
// //   res.render('shop/checkout', {
// //     path: '/checkout',
// //     pageTitle: 'Checkout'
// //   })
// // }

// exports.postOrders = (req, res, next) => {
//   let fetchedCart
//   req.user
//     .addOrder()
//     // // Get access to the cart.
//     // .getCart()
//     // // Get access to all products in cart.
//     // .then(cart => {
//     //   fetchedCart = cart
//     //   return cart.getProducts()
//     // })
//     // // All products in cart to create an order.
//     // .then(products =>
//     //   req.user
//     //     .createOrder()
//     //     // Associate products to an order
//     //     .then(order =>
//     //       order.addProduct(
//     //         products.map(product => {
//     //           // orderItem must match it's define in the models/order-item model
//     //           product.orderItem = { quantity: product.cartItem.quantity } // This adds a new quantity field in orders

//     //           return product
//     //         })
//     //       )
//     //     )
//     //     .catch(err => console.log(err))
//     // )
//     // .then(() => {
//     //   return fetchedCart.setProducts(null)
//     // })
//     .then(() => res.redirect('/orders'))
//     .catch(err => console.log(err))
// }

// exports.getOrders = (req, res, next) => {
//   req.user
//   // Sequel method
//     // .getOrders({ include: ['products'] })
//     .getOrders()
//     .then(orders => {
//       res.render('shop/orders', {
//         path: '/orders',
//         pageTitle: 'Orders',
//         orders: orders
//       })
//     })
//     .catch(err => console.log(err))
// }
