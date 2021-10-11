const express=require('express');
const router=express.Router();
const Product=require('../models/product');
const Review=require('../models/review');
const {isLoggedIn}=require('../middleware');

// Get all the products from database
router.get('/products',async(req,res)=>
{

    try{

        const products=await Product.find({});

    res.render('products/index',{products});

    }catch(e){

        req.flash('error',"OOPs,Something Went Wrong!")
        res.redirect('/error');
    }
    
});


// Get new form to create new product
router.get('/products/new',isLoggedIn,(req,res)=>
{

    res.render('products/new');
})

// create new product with given payload
router.post('/products',isLoggedIn,async(req,res)=>
{

    try{

        const newProduct={
            ...req.body
        }
        await Product.create(newProduct);
    
        req.flash('success','Product Created Successfully!');
        res.redirect('/products');

    }catch(e){

        req.flash('error',"OOPs,Something Went Wrong!")
        res.redirect('/error');

    }
    
})

// Show particular product
router.get('/products/:id',async(req,res)=>
{

    try{

        const {id}=req.params;

    //inflating the foundproduct with the  reviews using populate
    const product=await Product.findById(id).populate('reviews');

    res.render('products/show',{product});

    }catch(e)
    {
            req.flash('error',"OOPs,Something Went Wrong!")
            res.redirect('/error');
    }
    
})

//getting the edit from prefilled with data
router.get('/products/:id/edit',isLoggedIn,async(req,res)=>
{
    try{

        const {id}=req.params;
    const product= await Product.findById(id);

     res.render('products/edit',{product});

    }catch(e)
    {
        req.flash('error',"OOPs,Something Went Wrong!")
        res.redirect('/error');
    }
    
})

// updating product with given payload
router.patch('/products/:id',isLoggedIn,async(req,res)=>
{
    try{
        
        const updatedProduct=req.body;

        const {id}=req.params;
        await Product.findByIdAndUpdate(id,updatedProduct);
        res.redirect(`/products/${id}`);

    }catch(e)
    {
        req.flash('error',"OOPs,Something Went Wrong!")
        res.redirect('/error');
    }
   

})
//Delete particular product
router.delete('/products/:id',isLoggedIn,async(req,res)=>
{
    try{

        const {id}=req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');

    }catch(e)
    {
        req.flash('error',"OOPs,Something Went Wrong!")
        res.redirect('/error');
    }
    
});

//Creating review for each product
router.post('/products/:id/review',isLoggedIn,async(req,res)=>
{
    

    try{

        const {id}=req.params;
        const product=await Product.findById(id);
    
        const {rating,comment} =req.body;
    
        const review=new Review({rating,comment,user:req.user.username});
    
        product.reviews.push(review);
    
        await product.save();
        await review.save();  
        
        req.flash('success','Successfully Created Your Review!!')
        
        res.redirect(`/products/${id}`); 

    }catch(e){
        req.flash('error',"OOPs,Something Went Wrong!")
        res.redirect('/error');
    }
   
     
})



module.exports=router;