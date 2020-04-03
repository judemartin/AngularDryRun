const express = require('express');
const Post = require('./models/post')
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

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
        'GET, POST, PUT, PATCH,  DELETE, OPTIONS');    
    next();
});

//middleware
app.get('/api/posts', (req, res, next) => { 
    Post.find().then(documents => {
        res.status(200).json({
            message : "Posts sents successfully",
            posts: documents
        });
    }); 
});


app.post("/api/posts",(req, res, next) => { 
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });   
    post.save().then(result => {
        console.log(result);
        res.status(201).json({
            message : 'post added successfully',
            postId: post._id
        });
    }); 
});

app.delete("/api/posts/:id",(req, res, next) => { 
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Post deleted!'
        });
    }); 
});


module.exports = app;