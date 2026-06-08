const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema(
    {
        id : {type : Number},
        name : {type : String},
        color : {type : String},
        price : {type : Number}
    },
    {collection : "Fruits"}
);


module.exports = mongoose.model('Fruit', fruitSchema);