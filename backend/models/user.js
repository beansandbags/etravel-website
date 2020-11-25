const mongoose  = require('mongoose');
const TransactionSchema = require('./transaction').schema; 
const TicketSchema = require('./ticket').schema; 
const Schema = mongoose.Schema;
 
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    googleID:{
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    phone: {
        type: Number
    },
    address: {
        type: String
    },
    ticket: {
        type: Object,
        default: null,
    },
    hotel: {
        type: Object,
        default: null,
    },
    transaction_h: {
        type: [TransactionSchema],
        default: [],
    },
    transaction_h_hotel: {
        type: [TransactionSchema],
        default: [],
    }
 
});
 
module.exports = User = mongoose.model("user", UserSchema);