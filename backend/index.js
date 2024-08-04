const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Middleware setup
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://vishaljangid80:786786@cluster0.ycilskt.mongodb.net/")
.then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Ensure upload directory exists
const uploadDir = './upload/images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Image Storage Engine
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Serve static files
app.use('/images', express.static(uploadDir));

// Upload endpoint
app.post('/upload', upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.json({
        success: true,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Product Schema
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
});

const Product = mongoose.model('Product', productSchema);

// Add product endpoint
app.post('/addproduct', async (req, res) => {
    try {
        const products = await Product.find({});
        let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            available: req.body.available,
            date: req.body.date
        });
        await product.save();
        res.json({
            success: true,
            name: req.body.name
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, message: 'Failed to add product' });
    }
});

// Remove product endpoint
app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({
            success: true,
            name: req.body.name
        });
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ success: false, message: 'Failed to remove product' });
    }
});

// // Get all products endpoint
// app.get('/allproducts', async (req, res) => {
//     try {
//         const products = await Product.find({});
//         res.json(products);
//         res.send(products);
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         res.status(500).json({ success: false, message: 'Failed to fetch products' });
//     }
// });

// Get all products endpoint
app.get('/allproducts', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products); // Send the response once
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch products' }); // Send the error response once
    }
});


// Schema Crating for user model
const Users = mongoose.model('Users',{
    name:{
        type: String,
    },
    email:{
        type: String,
        unique: true,
    },
    password :{
        type: String,
    },
    cart:{
        type: Object,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

// Creating Endpoint for registering the user
app.post('/signup',async(req, res) => {
    let check = await Users.findOne({email: req.body.email})
    if(check){
        return res.status(400).json({success: false,error:'existing user found with same email address'})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
  
    await user.save();

    const data ={
        user:{
            id: user.id,
        }
    }
    const token = jwt.sign(data,'secret_ecom');
    res.json({success: true,token})
})

// Creating endpoint for user Login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({email: req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data ={
                user:{
                    id: user.id,
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success: true,token})
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"});
    }
})

// creating endpoint for newcollection data
app.get('/newcollections', async(req,res)=>{
  let products = await Product.find({});  
  let newcollection = products.slice(1).slice(-8);
  console.log("new collection fetched");
  res.send(newcollection);
})

// creating endpoint for popular in women
app.get('/popularinwomen', async(req,res)=>{
    let products = await Product.find({category: 'women'});  
    let popular_in_women = products.slice(0,4);
    console.log("popular in women fetched");
    res.send(popular_in_women);
})

// creating endpoint for adding products in cartdata
app.post('/addtocart', async(req,res)=>{
    console.log(req.body);
})

// Start server
app.listen(port, (err) => {
    if (!err) {
        console.log(`Server is running on port ${port}`);
    } else {
        console.log("Error:", err);
    }
});
