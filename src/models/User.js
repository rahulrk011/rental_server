const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    idCardPhoto:{
        type: String,
        required:true,
    },
    creditCardNumber:{
        type:String,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
