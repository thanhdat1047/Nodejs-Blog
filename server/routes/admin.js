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
router.get('/dashboard',authMiddleware,(req, res)=>{
    res.render('admin/dashboard')
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

module.exports = router;