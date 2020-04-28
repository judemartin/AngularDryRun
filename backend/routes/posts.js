const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const PostsController = require('..//controllers/posts');
const extractFile = require('../middleware/file');

router.get('', PostsController.getPosts); 

router.get("/:id", PostsController.getPost);

router.post("", checkAuth, extractFile, PostsController.createPost);

//dynamic segment
router.put('/:id', checkAuth, extractFile, PostsController.updatePost); 

router.delete('/:id', checkAuth, PostsController.deletePost);

module.exports = router;