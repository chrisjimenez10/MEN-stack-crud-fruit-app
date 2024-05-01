//Import
const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose"); 
const Fruit = require("./models/fruit.js"); //Requiring exported module from "./models/fruit.js file (It contains the collection we created in our database)
const methodOverride = require("method-override"); //Requiring the methodOverride pacakge to override default method of POST in HTML forms to whatever we want (DELTE, PUT)


//Connect to our Database
    //We pass the environment variable (MongoDB connection string) to the mongoose.connect() method --> process.env.VARIABLE_NAME is how we access the variable from the .env file (config() method sets the environment variables in the process.env object)
mongoose.connect(process.env.MONGODB_URI);
    //Mongoose event listener ("connected" is the listener, callback function is to log message to our terminal of the database name mongoose connected to) - Very useful to ensure we connected to the right database and for DEBUGGING later on
mongoose.connection.on("connected", ()=>{ 
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

const app = express();
app.use(morgan("dev")); //Log HTTP Requests
app.use(express.static("public")); //Middleware for computer to search and load up files from public directory (I have css stylesheets here)
app.use(methodOverride("_method")); //Setting a variable to use the methodOverride in HTML Forms

//Start Server
port = 4002;
app.listen(port, ()=>{
    console.log(`Listening on ${port}`);
})

//Middleware
    //This express method CAPTURES the URL encoded data (created via HTML Forms) and converts it to a JavaScript object --> It can then be accessed with the request object as the ".body" property (req.body)
app.use(express.urlencoded({extended:false}));

//Routes
app.get("/", (req, res)=>{
    res.render(`home.ejs`, {

    })
})

app.get("/fruits", async (req, res)=>{
    const foundFruits = await Fruit.find().sort({name: "asc"}); //We can chain built-in query methods to refine query results
    res.render("./index.ejs", { fruits: foundFruits });
})

app.post("/fruits/new", async (req, res)=>{ //CAN NOT access the URL because it's a POST (Only way is through HTML Forms - Ensure that action attribute has correct URL --> The route path HERE has to MATCH the URL in the action attribute of <form> tag)
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

    //Show page of fruit by id
app.get("/fruits/:fruitId", async (req, res)=>{
    const id = req.params.fruitId;
    const fruit = await Fruit.findById(id);
    res.render("./fruits/show.ejs", {
        fruit
    })
})

    //DELETE Route
app.delete("/fruits/:fruitId", async (req, res)=>{
    await Fruit.findByIdAndDelete(req.params.fruitId)
    res.redirect("/fruits")
})

    //Edit Show page
app.get("/fruits/:fruitId/edit", async (req, res)=>{
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("./fruits/edit.ejs", {
        fruit: foundFruit
    })
})

app.put("/fruits/:fruitId", async (req, res)=>{
    if(req.body.isReadyToEat === "on"){
        req.body.isReadyToEat = true;
    }else{
        req.body.isReadyToEat = false;
    }
    const fruit = await Fruit.findByIdAndUpdate(req.params.fruitId, req.body, {new: true}); //If we want to access the new object properties within our javascript file, we need to use the object {new:true} inside the mongoose function findByIdAndUpdate()
    console.log(fruit)
    res.redirect(`/fruits/${req.params.fruitId}`)
})
