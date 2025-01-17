const express = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema =new Schema({
    username : {type: String, required: true, unique:true},
    password : {type: String, required: true},
    posts: {type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post'}
})

module.exports = mongoose.model('User', UserSchema);