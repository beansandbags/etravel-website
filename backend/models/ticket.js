const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
// Create a Schema
const TicketSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    features: {
        type: [String]
    },
    seats: {
        type: Number,
        default: 70
    },
    purchases: {
        type: Number,
        default: 0
    },
    productImage:{
        type: String,
        required: true
    }
});
 
module.exports = Product = mongoose.model('product', TicketSchema);