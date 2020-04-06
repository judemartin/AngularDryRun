const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const multer = require('multer');
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
};
const storage = multer.diskStorage({
    destination: (req, file, cbk) => {
        const isVaild = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid MIME Type');
        if(isVaild) {
            error = null;
        } 
        cbk(error,  "backend/images", );
    },
    filename: (req, file, cbk) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extn = MIME_TYPE_MAP[file.mimetype];
        cbk(null, name + '-' + Date.now() + '.' + extn);
    }
}); 

router.get('', (req, res, next) => { 
    Post.find().then(documents => {
        res.status(200).json({
            message : "Posts sents successfully",
            posts: documents
        });
    }); 
});


router.get("/:id", (req, res, next) => {
    console.log(req.params.id); 
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    });
});

router.post(
    "", 
    multer({ storage: storage }).single("image"), 
    (req, res, next) => {  
    const url = req.protocol + "://"  + req.get("host"); 
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });   
    post.save().then(createdPost => {
        res.status(201).json({
            message : 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id 
            } 
         });
    }); 
});

//dynamic segment
router.put(
    '/:id', 
    multer({storage: storage}).single('image'),
    (req, res, next) => {
        let imagePath = req.body.imagePath;
        if(req.file) {
            const url = req.protocol + "://" + req.get("host");
            imagePath = url + '/images/' + req.file.filename;
        }
    console.log(req.file);
    const post = new Post ({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id}, post).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Post updated sucessfully!'
        });
    })
});


router.delete('/:id',(req, res, next) => { 
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Post deleted!'
        });
    }); 
});

module.exports = router;