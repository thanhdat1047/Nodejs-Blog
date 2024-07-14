require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const connectDB = require('./server/config/db');
const session = require('express-session');
const app = express();
const port = 5000 || process.env.PORT;

//Connect to DB
connectDB() 

app.use(express.urlencoded({extended:true}))
app.unsubscribe(express.json());
app.use(cookieParser());

app.use(session({
    secret: 'key fish',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}))

app.use(express.static('public'))

//Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main')
app.set('view engine','ejs')

app.use('/', require('./server/routes/index'))
app.listen(port, ()=>{
    console.log(`App listening on ${port}`);
})