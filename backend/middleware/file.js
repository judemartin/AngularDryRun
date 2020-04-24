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
module.exports = multer({ storage: storage }).single("image");