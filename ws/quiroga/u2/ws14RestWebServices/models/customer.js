const moongose = require('mongoose');

const customerSchema = new moongose.Schema(
    {
        id : {type : Number},
        name : {type : String},
        age : {type : Number},
        moneySpent : {type : Number}
    },
    {collection : "Customer"}
);


module.exports = moongose.model('Customer', customerSchema);