const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const PostSchema = new Schema({
    title:{
        type: String, 
        required: true       
    },
    body:{ 
        type:String, 
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // Refers to User model by id
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);
