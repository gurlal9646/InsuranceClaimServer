const express = require('express');

const router = express.Router();

const validateToken = require('../../middleware/validateToken'); 

router.use(validateToken); // Protect all routes beneath this point

// Import other API routes
const usersRouter = require('./users.js');
const productRouter = require('./product.js');
const userProductRouter = require('./userProducts.js')
const userClaimsRouter = require('./claims.js')

// Use the imported routes
router.use('/user', usersRouter);
router.use('/product', productRouter);
router.use('/userProducts', userProductRouter);
router.use('/claims', userClaimsRouter);



module.exports = router;