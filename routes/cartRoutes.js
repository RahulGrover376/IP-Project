const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');
const { isLoggedIn } = require('../middleware');
const https = require('https');


router.post('/cart/:productid/add', isLoggedIn, async (req, res) => {

    const { productid } = req.params;

    const product = await Product.findById(productid);

    const currentUser = req.user;

    currentUser.cart.push(product);

    await currentUser.save();

    req.flash('success', 'Item added to your cart successfully');
    res.redirect(`/products/${productid}`);
});

router.get('/user/cart', isLoggedIn, async (req, res) => {

    const userid = req.user._id;
    var totalAmount=0;
    var discount=0;
    const user = await User.findById(userid).populate('cart');

    for(let item of user.cart)
    totalAmount+=item.price 
    console.log(totalAmount)
    const url='https://shopping-cart-payment-api-100.herokuapp.com/discount/'+totalAmount
    https.get(url,function(response){
        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            console.log(parseInt(weatherData.discount));
            discount=parseInt(weatherData.discount);
            res.render('cart/userCart.ejs', { user,discount});
        })
    })

    // res.render('cart/userCart.ejs', { user,discount});


})

router.delete('/cart/:id/remove', isLoggedIn, async (req, res) => {
    const productid = req.params.id;

    const userid = req.user._id;

    await User.findByIdAndUpdate(userid, { $pull: { cart: productid } });

    res.redirect('/user/cart');
})

router.get('/payment', isLoggedIn, async (req, res) => {

    console.log("in payment...");
    res.render('public/checkout.ejs');
})



module.exports = router;
