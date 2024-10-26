const express = require('express'); 
const { default: mongoose } = require('mongoose');
const app = express(); 


//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


// Make Schema for Data-Base, 
// Build Schema with proper validation
const ProductSchema = new mongoose.Schema({
    title:{
        type:String,
        minLength:2,
        maxLength:50,
        trim:true,
        require: [true, "Product Name is Required"]
    }, 
    price:{
        type:Number, 
        min:1,
        trim:true,
        require: [true, "Product Price is Required"]
    }, 
    rating:{
        type:Number, 
        require:[true, "Rating is Required"],
        trim:true,
        min:1,
        max:5
    },
    mobile:{
        type:String,
        trim:true, 
        validate: {
            validator: function(v) {
              return /^\+\d{1,3}\d{9,10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          },
    }
}); 

// Make Models
const Product = new mongoose.model('Product', ProductSchema); 

// Create Connecting with MongoDB, 
const DataBaseConnection = async()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Products_4');
        console.log("Data-Base is Connected."); 
    } catch (error) {
        console.log("Data-Base is not Connected!"); 
        console.log(`Error-Message : ${error.message}`); 
    }
}; 



// Home Route
app.get('/',(req,res)=>{
    try {
       res.sendFile(__dirname + '/routes/home.routes.html'); 
    } catch (error) {
        res.status(404).send({
            message: "Home Page is not found!", 
            error_message: error.message
        }); 
    }
}); 

// Products get Route
app.get('/products',(req,res)=>{
   try {
    res.sendFile(__dirname + '/routes/products.routes.html'); 
   } catch (error) {
    res.status(404).send({
        message: "Products Page is not found!", 
        error_message: error.message
    }); 
   }
}); 

/*
For the Store Data into-DataBase using mongoDB, 
*/

// Add Product using POST Routes, 
app.post('/products',(req,res)=>{
    try {
       const AddNewProduct = new Product({
          title: req.body.title, 
          price: req.body.price, 
          rating:req.body.rating, 
          mobile:req.body.mobile
       }); 

       if(AddNewProduct){
        res.send(AddNewProduct.save()); // Save data into DataBase, 
       }else{
        res.status(500).send({
            operation:false,
            message:"Data can't Added!",
            error_message:error.message
        }); 
       }
    } catch (error) {
        res.status(404).send({
            operation:false, 
            message:"Product POST Route can't work!", 
            error_message: error.message
        });
    }
}); 

// Show Data in showAllProducts requests, 
app.get('/showAllProducts', async(req,res)=>{
    const rating = req.body.rating; 
    try {
        const newProduct = await Product.find().sort({rating:-1}); 
        res.send(newProduct); 
        
    } catch (error) {
        res.status(404).send({
            operation:false, 
            message:"showAllProducts Get Route can't work!", 
            error_message: error.message
        });
    }
}); 


// Search Data using using ID : get/:id 
app.get('/products/:id',async(req,res)=>{
    try {
        const id=req.params.id; 
        const searchProduct = await Product.find({_id:id}, {title:1, price:1,rating:1,_id:0 }); 
        res.send(searchProduct); 
    } catch (error) {
        res.status(404).send({
            operation:false, 
            message:"Product Get Route can't work!", 
            error_message: error.message
        });
    }
}); 

//Update Product Data Route, 
app.put('/products/:id', async(req,res)=>{
    try {
        const id = req.params.id; 
        const UpdateData = await Product.findByIdAndUpdate(
            {_id:id},
            {$set:{
                rating:2.9
            },
        }, {new:true}
        ); 
        res.send(UpdateData)
        
    } catch (error) {
        res.status(404).send({
            operation:false, 
            message:"Product PUT Route can't work!", 
            error_message: error.message
        }); 
    }
}); 


// Delete Data, 
app.delete('/products/:id', async(req,res)=>{
    try {
        const id = req.params.id; 
        const deleteData = await Product.findByIdAndDelete({_id:id}); 
        res.send(deleteData); 
    } catch (error) {
        res.status(404).send({
            operation:false, 
            message:"Product DELETE Route can't work!", 
            error_message: error.message
        }); 
    }
});

// Error Route, 
app.get('*', (req,res)=>{
    try {
       res.sendFile(__dirname + '/routes/error.routes.html'); 
    } catch (error) {
        res.status(404).send({
            message:"Error Route Problem", 
            error_message: error.message
        }); 
    }
}); 



module.exports = {app,DataBaseConnection}; 