const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const PostsController = require('..//controllers/posts');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
};
const storage = multer.diskStorage({
    destination: (req, file, cbk) => {
        const isVaild = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid MIME Type');
        if (isVaild) {
            error = null;
        }
        cbk(error, "backend/images");
    },
    filename: (req, file, cbk) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extn = MIME_TYPE_MAP[file.mimetype];
        cbk(null, name + '-' + Date.now() + '.' + extn);
    }
});

router.get('', PostsController.getPosts);


router.get("/:id", PostsController.getPost);

router.post(
    "",
    checkAuth,
    multer({ storage: storage }).single("image"), 
    PostsController.createPost);

//dynamic segment
router.put(
    '/:id',
    checkAuth,
    multer({ storage: storage }).single('image'),
    PostsController.updatePost);


router.delete('/:id', checkAuth, PostsController.deletePost );

module.exports = router;