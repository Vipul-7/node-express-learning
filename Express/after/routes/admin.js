const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");
const { check, body } = require("express-validator");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// // /admin/add-product => POST
router.post(
  "/add-product",
  isAuth,
  [
    body("title")
      .isLength({ min: 2 })
      .withMessage("Title length should be more than 2 characters"),
    body("price").isNumeric().withMessage("Price should be in number"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description should be minimum 5 characters long"),
  ],
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  isAuth,
  [
    body("title")
      .isLength({ min: 2 })
      .withMessage("Title length should be more than 2 characters"),
    body("price").isNumeric().withMessage("Price should be in number"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description should be minimum 5 characters long"),
  ],
  adminController.postEditProduct
);

router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
