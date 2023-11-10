const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
{
    fullName:{
        type: String,
        unique: true,
        required: [true, 'Please enter your Full Name']
    },

    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Please enter your a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    password:{
        type: String,
        required: [true, 'Please enter a valid password'],
        trim: true,
    },

    role:{
        type: String,
        enum: ['customer', 'rider'],
        default:'customer',
    }

},
{
    timestamps:true,
}
);


const Users = mongoose.model('users', usersSchema);

module.exports = Users;