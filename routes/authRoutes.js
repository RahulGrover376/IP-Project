const express=require('express');
const router=express.Router();
const User=require('../models/user');
const passport=require('passport');
const { application } = require('express');




// router.get('/fakeuser',async(req,res)=>
// {
//         const user=new User({

//                 username:'Rahul',
//                 email:'rgrover376@gmail.com'

//         });

//        const newUser=await User.register(user,'rahul13');

//        res.send(newUser);

// })

// Get the signup form
router.get('/register',(req,res)=>
{
        res.render('auth/signup');
})



//register the new user in database
router.post('/register',async(req,res)=>
{
        try{

                const {username,email,password}=req.body;

        const user=new User({

                username:username,
                email:email
        })

        await User.register(user,password);

        req.flash('success',`Welcome ${username},Please login to continue!`);
        res.redirect('/products');


        }catch(e)
        {       
                req.flash('error',e.message); 
                res.redirect('/register');
        }
})


router.get('/login',(req,res)=>
{
        res.render('auth/login');
})

router.post('/login',
  passport.authenticate('local', 
        {
          failureRedirect: '/login',
          failureFlash: true 
        }),     (req,res)=>
        {       
                const {username}= req.user;
                req.flash('success',`${username}, Welcome Back Again!!`);
                res.redirect('/products');

        });

router.get('/logout',(req,res)=>
{
        req.logout();
        
        req.flash('success','Logged out Successfully!!');
        res.redirect('/login');
})

module.exports=router;