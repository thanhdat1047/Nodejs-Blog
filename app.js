require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const connectDB = require('./server/config/db');

const app = express();
const port = 5000 || process.env.PORT;

//Connect to DB
connectDB() 

app.use(express.static('public'))

//Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main')
app.set('view engine','ejs')

app.use('/', require('./server/routes/index'))
app.listen(port, ()=>{
    console.log(`App listening on ${port}`);
})