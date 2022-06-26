const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const seedDB=require('./seed');
const methodOverride=require('method-override');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');

if(process.env.NODE_ENV!=="production")
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB Connected!!"))
.catch((err)=>console.log(err));

// seedDB();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));



const sessionConfig=
{
    secret:'Weneedsomebettersecret',
    resave:false,
    saveUninitialized:true,
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







app.use((req,res,next)=>{
res.locals.success =req.flash('success');
res.locals.error=req.flash('error');
res.locals.currentUser=req.user;
    next();
})

const productRoutes=require('./routes/productRoutes');
const authRoutes=require('./routes/authRoutes');
const cartRoutes=require('./routes/cartRoutes');

app.get('/',(req,res)=>
{
    res.render("home");

})

app.get('/error',(req,res)=>
{
    res.render('error');
})

app.use(productRoutes);
app.use(authRoutes); 
app.use(cartRoutes);

const port=process.env.PORT || 2323;
app.listen(port,()=>
{
    console.log("Server running at port 2323");
})



// This is your test secret API key.
const stripe = require("stripe")('sk_test_51LDUqOSCfsuDTslrf7WjSDKs4aSjDc8yLogxiA0OX44vssSTaWyimr6BaXzvgmN5vk3xokCrTXs2XwbqBUvFEMuR005NQmSTSO');

app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  console.log(items)
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});