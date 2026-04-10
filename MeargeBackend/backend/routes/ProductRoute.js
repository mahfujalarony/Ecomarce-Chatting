const express = require('express');
const route = express.Router();
const { createProduct, getPublicProductById, getPublicProducts, getRelatedPublicProducts, search } = require('../controllers/productController');
const { getHomeSections } = require('../controllers/Home');
const protect  = require('./../middleware/Middleware')
const requireAdminOrSubAdminPermission = require("../middleware/requireAdminOrSubAdminPermission");


route.get("/", getPublicProducts);
route.get("/home", getHomeSections);
route.get('/search', search);
route.get("/:id/related", getRelatedPublicProducts);

// upload a product for admin
route.post('/create', protect, requireAdminOrSubAdminPermission("create_products"), createProduct);
route.get("/:id", getPublicProductById);



module.exports = route;
