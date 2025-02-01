// mongoose

const Order = require('../models/order')
const Product = require('../models/product')

exports.getProducts = (req, res, next) => {
  Product.find()
    .populate('userId') // Populates the userId field with all data related to the userId key.
    .then(results => {
      res.render('shop/product-list', {
        prods: results,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .populate('userId') // Populates the userId field with all data related to the userId key.
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
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
        product: product,
        isAuthenticated: req.session.isLoggedIn
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
        products: products,
        isAuthenticated: req.session.isLoggedIn
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
    .then(user => {
      // Fetch all items in cart.
      console.log('cart product: ', user.cart.items)
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc }
        }
      })
      // Use the cart items to create the order.
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      })
      order.save()
    })
    .then(() => {
      return req.user.clearCart()
    })
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  // find all orders by userId
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
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
