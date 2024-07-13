const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', (req, res) =>{
    const locals = {
        title : 'NodeJS Blog'
    }
    res.render('index',{locals});    
});

function insertPostData (){
    Post.insertMany([
        {
            title : 'First Post',
            body : 'This is the first post on the blog'
        },

    ])
}
insertPostData();

router.get('/about', (req, res) =>{
    res.render('about');    
});

module.exports = router;