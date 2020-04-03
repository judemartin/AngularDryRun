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
        'GET, POST, PUT, PATCH, DELETE, OPTIONS');    
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

app.get("/api/posts/:id", (req, res, next) => {
    console.log(req.params.id); 
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
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

//dynamic segment
app.put("/api/posts/:id", (req, res, next) => {
    const post = new Post ({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({ _id: req.params.id}, post).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Post updated sucessfully!'
        });
    })
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