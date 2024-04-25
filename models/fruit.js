//Import Mongoose
const mongoose = require("mongoose");

//Create Mongoose Schema
const fruitSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: Boolean
})

//Create model/collection (Applying the fruitSchema)
const Fruit = mongoose.model("Fruit", fruitSchema);

//Export model (So we can use and access it in our other files)
module.exports = Fruit;