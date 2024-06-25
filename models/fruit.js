const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        isReadyToEat: Boolean,
    }
});

const Fruit = mongoose.model("Fruit", fruitSchema);
module.exports = Fruit;