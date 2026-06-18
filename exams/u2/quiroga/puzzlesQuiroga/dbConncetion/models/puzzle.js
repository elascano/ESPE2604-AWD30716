const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema(
    {
        serialNumber : {type : Number},
        brand : {type : String},
        model : {type : String},
        pieces : {type : Number},
        difficulty : {type : Number},
        brandNew : {type : Boolean},
        price : {type : Number},
        estimatedHours : {type : Number}
    },
    {collection : "puzzles"}
);


module.exports = mongoose.model('Puzzle', puzzleSchema);
