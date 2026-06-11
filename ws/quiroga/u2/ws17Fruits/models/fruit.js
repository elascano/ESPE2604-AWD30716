const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema(
    {
        id : {type : Number},
        name : {type : String},
        description : {type : String},
        color : {type : String},
        buyPrice : {type : Number},
        sellPrice : {type : Number},
        earnings : {type : Number},
        category : {type : String}
    },
    {collection : "fruit"}
);


module.exports = mongoose.model('Fruit', fruitSchema);