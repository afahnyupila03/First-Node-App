const Product = require('../models/product')

// mongoose
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const imageUrl = req.body.imageUrl

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user // Associates user to product.
  })

  product
    .save()
    .then(() => {
      console.log('create success')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        pageTitle: 'Admin Products',
        path: '/admin/products',
        prods: products,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit

  if (!editMode) return res.redirect('/')

  const prodId = req.params.productId

  Product.findById(prodId)
    .then(product => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        isAuthenticated: req.session.isLoggedIn,
        product: product
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const imageUrl = req.body.imageUrl
  console.log('to be updated product: ', productId)

  Product.findById(productId)
    .then(product => {
      product.title = title
      product.price = price
      product.description = description
      product.imageUrl = imageUrl

      return product.save()
    })
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log('Error editing product: ', err))
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.findByIdAndDelete(productId)
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

// // const { where } = require('sequelize')
// const Product = require('../models/product')

// exports.getAddProduct = (req, res, next) => {
//   res.render('admin/edit-product', {
//     pageTitle: 'Add Product',
//     path: '/add-product',
//     editing: false
//   })
// }

// exports.getProducts = (req, res, next) => {
//   Product.fetchAll()
//     .then(products => {
//       res.render('admin/products', {
//         pageTitle: 'Admin Products',
//         path: '/admin/products',
//         prods: products
//       })
//     })
//     .catch(err => console.log(err))
// }

// exports.postAddProduct = (req, res, next) => {
//   const title = req.body.title
//   const imageUrl = req.body.imageUrl
//   const price = req.body.price
//   const description = req.body.description

//   const userId = req.user._id

//   console.log('User Id: ', req.body)

//   //   // Method chains the product to the user adding the product.
//   //   req.user
//   //     .createProduct({
//   //       title: title,
//   //       price: price,
//   //       imageUrl: imageUrl,
//   //       description: description
//   //     })

//   // When creating  new product, set product-id to null.
//   // To associate product to user, pass userId.
//   const product = new Product(title, price, description, imageUrl, null, userId)
//   product
//     .save()
//     .then(result => {
//       console.log(result)
//       res.redirect('/admin/products')
//     })
//     .catch(err => console.log(err))
// }

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit

//   if (!editMode) return res.redirect('/')

//   const prodId = req.params.productId

//   //   // Fetches the product for authenticated user by product id && userId
//   //   req.user
//   //     .getProducts({ where: { id: prodId } })
//   //     .then(products => {
//   //       const product = products[0]
//   //       if (!product) return res.redirect('/')

//   //       console.log('Editing Product: ', product)
//   Product.fetchProduct(prodId)
//     .then(product => {
//       res.render('admin/edit-product', {
//         pageTitle: 'Edit Product',
//         path: '/admin/edit-product',
//         editing: editMode,
//         product: product
//       })
//     })
//     .catch(err => console.log(err))
// }
// // 679035bf2c571137721de5bf
// exports.postEditProduct = (req, res, next) => {
//   const productId = req.body.productId
//   const title = req.body.title
//   const price = req.body.price
//   const description = req.body.description
//   const imageUrl = req.body.imageUrl
//   console.log('to be updated product: ', productId)

//   const product = new Product(title, price, description, imageUrl, productId)

//   product
//     .save()
//     .then(product => {
//       // console.log('Success editing product: ', product._id)
//       res.redirect('/admin/products')
//     })
//     .catch(err => console.log('Error editing product: ', err))
// }

// exports.postDeleteProduct = (req, res, next) => {
//   const productId = req.body.productId
//   Product
//     // Sequel method
//     // .findOne({
//     //   where: {
//     //     id: productId
//     //   }
//     // })
//     .deleteById(productId)
//     .then(product => {
//       return product.destroy()
//     })
//     .then(() => {
//       console.log('Product deleted with id: ', productId)
//       res.redirect('/admin/products')
//     })
//     .catch(err => console.log(err))
// }
