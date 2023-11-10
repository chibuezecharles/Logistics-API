const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
{
    address: {
        type: String,
        required: [true, 'Please enter your Address']
    },
    destinationAddress: {
        type: String,
        required: [true, 'Please enter the Destination Address']
    },
    weight: {
        type: Number,
        required: [true, 'Please enter the Weight of the Item']
    },
    cost: {
        type: Number,
        default: 1000 ,
    },
    status: {
        type: String, 
        default: 'pending', 
    },
    riderId: {
        type: mongoose.Schema.ObjectId, 
        default: null ,
    },
    customerId: {
        type: mongoose.Schema.ObjectId,
        ref:'users',
    },

},
{
    timestamps:true,
}
);


const Requests = mongoose.model('requests', requestSchema);

module.exports = Requests;