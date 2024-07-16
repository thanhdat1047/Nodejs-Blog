const express = require('express');
const router = express.Router();
const Post =require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminLayout = '../views/layouts/admin.ejs';
const jwtSecret = process.env.JWT_SECRET;

// Check Login
const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: ' Unauthorized'});
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({message: ' Unauthorized'});
    }
}

// GET admin
router.get('/', async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog"
        }
        res.render('admin/index', { locals, layout: adminLayout })
    } catch (error) {
        console.log(error);
    }
});

// [POST] admin/login

router.post('/login',async (req,res)=>{
    try {
        const {username, password} = req.body
        const user =await User.findOne({username}) 
        if(!user){
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: 'Password is wrong'});
        }

        const token = jwt.sign({userId: user._id},jwtSecret );
        res.cookie('token', token);

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
    }
})

// [GET] /admin/dashboard
router.get('/dashboard',authMiddleware,async (req, res)=>{
    try {
        const locals ={ 
            title: "Dashboard", 
        }
        const data = await Post.find();
        res.render('admin/dashboard',{
            data,
            locals,
            layout: adminLayout
        })
    } catch (error) {
        
    }
    
    
})

// [POST] admin/register

router.post('/register',async (req,res)=>{
    try {
        const locals = {
            title: "NodeJs Blog"
        }
        const {username, password} = req.body
        const hashPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({username,password: hashPassword})
            res.status(200).json({message:"User created successfully"}, user)
        } catch (error) {
            if(error.code === 11000){
                res.status(409).json({mesage: 'User already exists'});
            }
            res.status(500).json({message: 'Server error'});    
        }

        res.redirect('/admin');
    } catch (error) {
        console.log(error);
    }
})

// [GET] /admin/add-post
router.get('/add-post', authMiddleware,async (req, res) => {
    try {
        const locals = {
            title: "Add Post"
        }
        res.render('admin/add-post', { locals, layout: adminLayout })

    } catch (error) {
        
    }
})

// [POST] /admin/add-post
router.post('/add-post', authMiddleware,async (req, res) => {
    try {
        const locals = {
            title: "Add Post"
        }
        try {
            const newsPost = new Post({
                title: req.body.title,
                body: req.body.body,
                author: req.userId
            })
            await Post.create(newsPost);
            res.send(newsPost)
            const user = await User.findById(req.userId)
            user
            //res.redirect('/admin/dashboard')
        } catch (error) {
            console.log(error) 
        }
    } catch (error) {
        console.log(error);
    }
})

// [GET] /admin/edit-post
router.get('/edit-post/:id', authMiddleware,async (req, res) => {
    try {
        const locals = {
            title: "Edit Post"
        }
        const {id} = req.params
        const data = await Post.findById(id)
        //res.send(data)
        res.render('admin/edit-post', { locals, layout: adminLayout,data })

    } catch (error) {
        console.log(error);
    }
})

// [PUT] admin/edit-post
router.put('/edit-post/:id',authMiddleware, async (req,res)=>{
    try {
        const {id} = req.params;
        console.log(id);
        const data  = await Post.findByIdAndUpdate(id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        })
        //res.send(data)
        res.redirect(`/admin/edit-post/${req.params.id}`);
        
    } catch (error) {
        console.log(error);
    }
})

// [DELETE] /admin/delete-post 
router.delete('/delete-post/:id', authMiddleware,async (req,res)=>{
    try {
        const {id} = req.params;
        await Post.deleteOne({_id:id});
        return res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;