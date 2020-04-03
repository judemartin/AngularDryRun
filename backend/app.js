const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');

mongoose.connect('mongodb+srv://admin:QSp897CTgjSIDfEY@cluster0-3nieq.azure.mongodb.net/angular-dryrun')
        .then(() => {
            console.log('connected to the database');
        })
        .catch(() => {
            console.log('connection failed');
        });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS');    
    next();
}); 

app.use("/api/posts", postsRoutes);

module.exports = app;