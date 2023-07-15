const Product = require("../models/product")

exports.getAddProduct = (req, res, next) => {
  // res.send(
  //   '<form action="product" method="POST"><input type="text" name="product"/><button>Add Product</button></form>'
  // ); // automatically set the header
  // next();

  // res.sendFile(path.join(__dirname, "..", "Views", "add-product.html")); // __dirname give us the absolute path to the current file
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save(); 
  res.redirect("/"); // instead of using the status code and setHeader
};

exports.getProducts = (req, res, next) => {
  // // res.send("<h1>Hi! This is a home Page"); // automatically set the header
  // console.log(adminData.data);

  // res.sendFile(path.join(__dirname, "..", "views", "shop.html")); // __dirname give us the absolute path to the current file

  const products = Product.fetchAll();
  res.render("shop", { prods: products, pageTitle: "Shop", path: "/" }); // to use default templating engine
};
