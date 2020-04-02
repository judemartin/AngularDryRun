const express = require('express');
const bodyParser = require('body-parser');
const app = express();

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
app.use('/api/posts', (req, res, next) => {
    const posts  = [
        { 
            id: 'fadf1234',
            title: 'First server-side post',
            content: 'This is coming from the server'
        },
        { 
            id: 'aasdg3sdf',
            title: 'Secong server-side post',
            content: 'This is coming from the server!'
        }
    ];
    
    res.status(200).json({
        message : "Posts sents successfully",
        posts: posts
    });
});


app.post("/api/posts",(req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message : 'post added successfully'
    });
});


module.exports = app;