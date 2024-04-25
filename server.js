//Import
const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose"); 
const Fruit = require("./models/fruit.js"); //Requiring exported module from "./models/fruit.js file (It contains the collection we created in our database)

//Connect to our Database
    //We pass the environment variable (MongoDB connection string) to the mongoose.connect() method --> process.env.VARIABLE_NAME is how we access the variable from the .env file (config() method sets the environment variables in the process.env object)
mongoose.connect(process.env.MONGODB_URI);
    //Mongoose event listener ("connected" is the listener, callback function is to log message to our terminal of the database name mongoose connected to) - Very useful to ensure we connected to the right database and for DEBUGGING later on
mongoose.connection.on("connected", ()=>{ 
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

const app = express();
app.use(morgan("dev")); //Log HTTP Requests

//Start Server
port = 4000;
app.listen(port, ()=>{
    console.log(`Listening on ${port}`);
})

//Middleware
    //This express method CAPTURES the URL encoded data (created via HTML Forms) and converts it to a JavaScript object --> It can then be accessed with the request object as the ".body" property (req.body)
app.use(express.urlencoded({extended:false}));

//Routes
app.get("/", (req, res)=>{
    res.render(`index.ejs`, {

    })
})

app.get("/fruits", async (req, res)=>{
    const foundFruits = await Fruit.find();
    res.send(foundFruits);
})

app.post("/fruits", async (req, res)=>{ //CAN NOT access the URL because it's a POST (Only way is through HTML Forms - Ensure that action attribute has correct URL --> The route path HERE has to MATCH the URL in the action attribute of <form> tag)
    console.log(req.body);
        //JavaScript logic and data manipulation to convert isReadyToEat value from string "on" to a boolean value (because that is what we specified in our Schema)
    if(req.body.isReadyToEat === "on"){
        req.body.isReadyToEat = true;
    }else{
        req.body.isReadyToEat = false;
    }
    const createdFruit = await Fruit.create(req.body); //Creating object
    // res.send(createdFruit); //The JavaScript object created by the "urlencoded method " can be acessed from the request object with the body property (req.body)
    res.redirect("/fruits"); // res.redirect is a method of the response object that REDIRECTS user/client to the assigned route path inside the parenthesis (Here, we want to redirect user to the route that displays ALL fruits in database rather than to the create page, which will only show the single created fruit)
})

app.get("/fruits/new", (req, res)=>{
    res.render("./fruits/new.ejs", {

    })
})
